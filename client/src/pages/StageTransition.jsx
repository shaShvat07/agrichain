import React from "react";
// src/pages/StageTransition.jsx - Fixed version
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { productService, supplyChainService } from '../services/api';

const StageTransition = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');

    // Determine transition type from both route path and query param
    // This is the key fix for the "Unknown transition type" error
    let transitionType;
    if (location.pathname.includes('record-planting')) {
        transitionType = 'planting';
    } else if (location.pathname.includes('record-growth')) {
        transitionType = 'growth';
    } else {
        transitionType = queryParams.get('type') || 'planting';
    }

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        productId: productId || '',
        stakeholderId: '', // This should come from auth context in a real app
        date: new Date().toISOString().split('T')[0],
        notes: '',
        additionalInfo: {}
    });

    // Get transition details based on type
    const getTransitionDetails = () => {
        const transitions = {
            planting: {
                title: 'Record Planting',
                subtitle: 'Document when the crop was planted',
                currentStage: 'Registered',
                nextStage: 'Planted',
                fields: [
                    {
                        name: 'additionalInfo.seedType',
                        label: 'Seed Type',
                        type: 'text',
                        placeholder: 'Enter seed type/variety'
                    },
                    {
                        name: 'additionalInfo.plotLocation',
                        label: 'Plot Location',
                        type: 'text',
                        placeholder: 'Enter plot/field location'
                    }
                ]
            },
            growth: {
                title: 'Record Growth Stage',
                subtitle: 'Document the growth stage of the crop',
                currentStage: ['Planted', 'Growing'],
                nextStage: 'Growing',
                fields: [
                    {
                        name: 'additionalInfo.growthStage',
                        label: 'Growth Stage',
                        type: 'select',
                        options: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Mature'],
                        placeholder: 'Select growth stage'
                    },
                    {
                        name: 'additionalInfo.height',
                        label: 'Plant Height',
                        type: 'text',
                        placeholder: 'Average plant height (cm)'
                    },
                    {
                        name: 'additionalInfo.healthStatus',
                        label: 'Plant Health',
                        type: 'select',
                        options: ['Excellent', 'Good', 'Average', 'Poor', 'Concerning'],
                        placeholder: 'Select plant health status'
                    }
                ]
            }
        };

        return transitions[transitionType] || transitions.planting;
    };

    const transitionDetails = getTransitionDetails();

    // Fix for multiple API calls - adding productId as dependency properly
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setLoading(false);
                return;
            }

            try {
                const response = await productService.getProductById(productId);
                setProduct(response.data);

                // Verify if product is in the correct stage for this transition
                const currentStage = response.data.currentStage;
                const validStages = Array.isArray(transitionDetails.currentStage)
                    ? transitionDetails.currentStage
                    : [transitionDetails.currentStage];

                if (!validStages.includes(currentStage)) {
                    setMessage({
                        text: `Product is not in the correct stage for ${transitionDetails.title}. Current stage: ${currentStage}`,
                        type: 'error'
                    });
                }
            } catch (error) {
                setMessage({
                    text: 'Failed to load product. Please make sure the product ID is correct.',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        if (loading) {
            fetchProduct();
        }
    }, [productId, transitionDetails, loading]); // Added proper dependencies

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Handle nested properties (additionalInfo)
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            // Handle top-level properties
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (submitting) {
            return;
        }

        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            let response;

            switch (transitionType) {
                case 'planting':
                    response = await supplyChainService.recordPlanting(
                        formData.productId,
                        formData.stakeholderId,
                        formData.date,
                        formData.additionalInfo
                    );
                    break;
                case 'growth':
                    response = await supplyChainService.recordGrowth(
                        formData.productId,
                        formData.stakeholderId,
                        formData.additionalInfo
                    );
                    break;
                default:
                    throw new Error(`Unknown transition type: ${transitionType}`);
            }

            setMessage({
                text: `${transitionDetails.title} recorded successfully!`,
                type: 'success'
            });

            // Navigate back to product details after successful submission
            setTimeout(() => {
                navigate(`/products/${formData.productId}`);
            }, 1500);

        } catch (error) {
            console.error("Transition error:", error);
            setMessage({
                text: error.message || `Failed to record ${transitionDetails.title.toLowerCase()}.`,
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to={productId ? `/products/${productId}` : '/products'} className="text-green-600 hover:text-green-800">
                    ← Back to {productId ? 'Product Details' : 'Products'}
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-green-800 mb-2">{transitionDetails.title}</h1>
            <p className="text-gray-600 mb-6">{transitionDetails.subtitle}</p>

            {message.text && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                    <p className="mt-2 text-gray-600">Loading product details...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    {/* Display current transition type for debugging */}
                    <div className="mb-4 p-2 bg-gray-100 text-xs text-gray-500 rounded">
                        Transition type: {transitionType}
                    </div>

                    {/* Product selection or display */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="productId">
                            Product ID*
                        </label>
                        <input
                            type="text"
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            disabled={!!productId}
                            required
                            className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${productId ? 'bg-gray-100' : ''
                                }`}
                            placeholder="Enter product ID"
                        />
                    </div>

                    {/* Display product info if we have it */}
                    {product && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-700 mb-2">Product Details</h3>
                            <p><strong>Name:</strong> {product.name}</p>
                            <p><strong>Description:</strong> {product.description}</p>
                            <p><strong>Current Stage:</strong> {product.currentStage}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="stakeholderId">
                            Stakeholder ID*
                        </label>
                        <input
                            type="text"
                            id="stakeholderId"
                            name="stakeholderId"
                            value={formData.stakeholderId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your stakeholder ID"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
                            Date*
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Dynamic fields based on transition type */}
                    {transitionDetails.fields.map((field, index) => (
                        <div className="mb-4" key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.name}>
                                {field.label}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={field.name.includes('.')
                                        ? formData[field.name.split('.')[0]][field.name.split('.')[1]] || ''
                                        : formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">{field.placeholder}</option>
                                    {field.options.map((option, optIndex) => (
                                        <option key={optIndex} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={field.name.includes('.')
                                        ? formData[field.name.split('.')[0]][field.name.split('.')[1]] || ''
                                        : formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder={field.placeholder}
                                />
                            )}
                        </div>
                    ))}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter any additional notes"
                        ></textarea>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-6">
                        <button
                            type="submit"
                            disabled={submitting || (product && !Array.isArray(transitionDetails.currentStage)
                                ? product.currentStage !== transitionDetails.currentStage
                                : !transitionDetails.currentStage.includes(product.currentStage))}
                            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${submitting || (product && !Array.isArray(transitionDetails.currentStage)
                                    ? product.currentStage !== transitionDetails.currentStage
                                    : !transitionDetails.currentStage.includes(product.currentStage))
                                    ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {submitting ? 'Processing...' : `Record ${transitionDetails.title.split(' ').pop()}`}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default StageTransition;