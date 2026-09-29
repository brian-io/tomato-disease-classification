import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

import {
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Typography,
} from '@mui/material';

import backgroundImage from '../public/bg.jpg';
import thlogo from '../public/thlogo.png';

import './index.css';


const API_URL = import.meta.env.VITE_API_URL;


/*
 * Application shell for the tomato diagnostic interface.
 */
export default function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    /*
     * Release the preview URL when the selected file changes.
     */
    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return undefined;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);


    /*
     * Submit the selected specimen to the FastAPI classifier.
     */
    const sendFile = async (file) => {
        if (!file) {
            return;
        }

        setIsLoading(true);
        setData(null);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                API_URL,
                formData
            );

            if (response.status === 200) {
                setData(response.data);
            }
        } catch (requestError) {
            console.error('Prediction request failed:', requestError);

            setError(
                'Unable to establish a diagnostic link with the classification server.'
            );
        } finally {
            setIsLoading(false);
        }
    };


    /*
     * Handle a specimen selected through the dropzone.
     */
    const onSelectFile = (files) => {
        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];

        setSelectedFile(file);
        setData(null);
        setError(null);

        sendFile(file);
    };


    /*
     * Configure the specimen intake area.
     */
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    } = useDropzone({
        onDrop: onSelectFile,
        accept: {
            'image/*': [],
        },
        multiple: false,
    });


    /*
     * Reset the diagnostic session.
     */
    const clearData = () => {
        setSelectedFile(null);
        setPreview(null);
        setData(null);
        setError(null);
        setIsLoading(false);
    };


    const confidence = data
        ? (parseFloat(data.confidence) * 100).toFixed(2)
        : null;


    return (
        <Box
            className="app-shell"
            sx={{
                backgroundImage: `
                    linear-gradient(
                        rgba(3, 8, 18, 0.88),
                        rgba(3, 8, 18, 0.94)
                    ),
                    url(${backgroundImage})
                `,
            }}
        >

            {/* Atmospheric background elements */}
            <Box className="background-grid" />
            <Box className="background-glow background-glow-one" />
            <Box className="background-glow background-glow-two" />


            {/* Top navigation / system status */}
            <header className="topbar">

                <Box className="brand">
                    <Box className="logo-frame">
                        <AvatarLogo />
                    </Box>

                    <Box>
                        <Typography className="brand-title">
                            TOMATO<span>HEALTH</span>
                        </Typography>

                        <Typography className="brand-subtitle">
                            BIOLOGICAL DIAGNOSTICS NETWORK
                        </Typography>
                    </Box>
                </Box>


                <Box className="system-status">
                    <Box className="status-dot" />

                    <Typography>
                        SYSTEM ONLINE
                    </Typography>
                </Box>

            </header>


            {/* Main diagnostic console */}
            <main className="diagnostic-layout">

                <section className="intro-panel">

                    <Typography className="eyebrow">
                        // SPECIMEN ANALYSIS PROTOCOL 07
                    </Typography>

                    <Typography className="main-title">
                        Identify the
                        <span> unknown.</span>
                    </Typography>

                    <Typography className="description">
                        Upload a tomato leaf specimen and allow the
                        diagnostic engine to classify its biological condition.
                    </Typography>


                    <Box className="telemetry">

                        <TelemetryItem
                            label="MODEL"
                            value="TOMATO-NET"
                        />

                        <TelemetryItem
                            label="ENGINE"
                            value="TENSORFLOW"
                        />

                        <TelemetryItem
                            label="CHANNEL"
                            value="IMAGE"
                        />

                    </Box>

                </section>


                <section className="scanner-section">

                    {/* Scanner corner markers */}
                    <Box className="scanner-corner corner-tl" />
                    <Box className="scanner-corner corner-tr" />
                    <Box className="scanner-corner corner-bl" />
                    <Box className="scanner-corner corner-br" />


                    {!selectedFile && (
                        <Box
                            {...getRootProps()}
                            className={`drop-zone ${
                                isDragActive ? 'drop-zone-active' : ''
                            } ${
                                isDragReject ? 'drop-zone-reject' : ''
                            }`}
                        >

                            <input {...getInputProps()} />


                            <Box className="scanner-icon">

                                <Box className="scanner-ring">
                                    <Box className="scanner-core">
                                        +
                                    </Box>
                                </Box>

                            </Box>


                            <Typography className="drop-title">
                                {isDragActive
                                    ? 'SPECIMEN DETECTED'
                                    : 'INSERT SPECIMEN'}
                            </Typography>


                            <Typography className="drop-description">
                                {isDragActive
                                    ? 'Release to begin biological analysis'
                                    : 'Drop a leaf image here or select a file'}
                            </Typography>


                            <Box className="upload-button">
                                SELECT SPECIMEN
                            </Box>


                            <Typography className="file-hint">
                                JPG / JPEG / PNG
                            </Typography>

                        </Box>
                    )}


                    {selectedFile && (
                        <Box className="analysis-panel">

                            <Box className="image-container">

                                <Card className="specimen-card">

                                    <CardMedia
                                        component="img"
                                        image={preview}
                                        alt="Tomato leaf specimen"
                                    />

                                    <Box className="scan-line" />

                                    <Box className="image-label">
                                        SPECIMEN // LIVE FEED
                                    </Box>

                                </Card>

                            </Box>


                            <Box className="analysis-information">

                                <Typography className="analysis-label">
                                    BIOLOGICAL SCAN
                                </Typography>


                                {isLoading && (
                                    <Box className="processing">

                                        <CircularProgress
                                            size={42}
                                            thickness={2}
                                            className="alien-spinner"
                                        />

                                        <Box>
                                            <Typography className="processing-title">
                                                ANALYZING SPECIMEN
                                            </Typography>

                                            <Typography className="processing-subtitle">
                                                Neural classification in progress...
                                            </Typography>
                                        </Box>

                                    </Box>
                                )}


                                {error && (
                                    <Box className="error-panel">

                                        <Typography className="error-code">
                                            SIGNAL LOST // 500
                                        </Typography>

                                        <Typography className="error-message">
                                            {error}
                                        </Typography>

                                    </Box>
                                )}


                                {data && !isLoading && (
                                    <Box className="result-panel">

                                        <Typography className="result-label">
                                            CLASSIFICATION
                                        </Typography>

                                        <Typography className="result-value">
                                            {formatClassName(data.class)}
                                        </Typography>


                                        <Box className="confidence-container">

                                            <Box className="confidence-header">

                                                <Typography>
                                                    CONFIDENCE
                                                </Typography>

                                                <Typography>
                                                    {confidence}%
                                                </Typography>

                                            </Box>


                                            <Box className="confidence-track">
                                                <Box
                                                    className="confidence-fill"
                                                    sx={{
                                                        width: `${confidence}%`,
                                                    }}
                                                />
                                            </Box>

                                        </Box>


                                        <Box className="result-status">

                                            <Box className="status-dot" />

                                            <Typography>
                                                DIAGNOSTIC COMPLETE
                                            </Typography>

                                        </Box>

                                    </Box>
                                )}


                                <Button
                                    className="clear-button"
                                    onClick={clearData}
                                >
                                    NEW SPECIMEN
                                </Button>

                            </Box>

                        </Box>
                    )}

                </section>

            </main>


            {/* Bottom system information */}
            <footer className="system-footer">

                <Typography>
                    TH // BIOLOGICAL INTELLIGENCE SYSTEM
                </Typography>

                <Typography>
                    NODE 01
                </Typography>

                <Typography>
                    v1.0.0
                </Typography>

            </footer>

        </Box>
    );
}


/*
 * Small logo treatment using the existing application logo.
 */
function AvatarLogo() {
    return (
        <img
            src={thlogo}
            alt="Tomato Health"
            className="brand-logo"
        />
    );
}


/*
 * Compact diagnostic telemetry field.
 */
function TelemetryItem({ label, value }) {
    return (
        <Box className="telemetry-item">

            <Typography className="telemetry-label">
                {label}
            </Typography>

            <Typography className="telemetry-value">
                {value}
            </Typography>

        </Box>
    );
}


/*
 * Convert model class names into readable diagnostic labels.
 */
function formatClassName(value) {
    if (!value) {
        return 'UNKNOWN';
    }

    return value
        .replace(/^Tomato___/, '')
        .replace(/_/g, ' ')
        .replace(/Two-spotted spider mite/i, 'Two-Spotted Spider Mite');
}