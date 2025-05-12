/**
 * camera.js - Webcam handling for Prepvue
 * Handles camera initialization, preview, and recording
 */

// Global variables
let stream = null;        // MediaStream from getUserMedia
let mediaRecorder = null; // MediaRecorder instance
let recordedChunks = [];  // Array to hold recorded video data
let isRecording = false;  // Flag to track recording state
let lastRecordingURL = null; // URL for the last recording

// DOM Elements - will be initialized in the setup function
let videoElement;
let recordButton;
let resetButton;
let playbackButton;

/**
 * Initialize webcam when the page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM references
    videoElement = document.getElementById('preview');
    recordButton = document.getElementById('recordButton');
    resetButton = document.getElementById('resetButton');
    playbackButton = document.getElementById('playbackButton');
    
    // Set up event listeners
    if (recordButton) {
        recordButton.addEventListener('click', toggleRecording);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetCamera);
    }
    
    if (playbackButton) {
        playbackButton.addEventListener('click', showRecordedVideo);
        // Hide playback button initially
        playbackButton.classList.add('hidden');
    }
    
    // Initialize camera
    initializeCamera();
});

/**
 * Initialize the camera and display preview
 */
async function initializeCamera() {
    try {
        // Request camera access with HD resolution as mentioned in requirements
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        });
        
        // Display camera preview
        if (videoElement) {
            videoElement.srcObject = stream;
        }
        
        // Enable record button
        if (recordButton) {
            recordButton.disabled = false;
        }
        
        console.log('Camera initialized successfully');
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please ensure camera permissions are granted.');
    }
}

/**
 * Toggle recording state
 */
function toggleRecording() {
    if (!stream) {
        console.error('No camera stream available');
        return;
    }
    
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

/**
 * Start recording video
 */
function startRecording() {
    recordedChunks = [];
    
    // Create MediaRecorder with the camera stream
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    // Handle data available event to collect recorded chunks
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    // Handle recording stopped event
    mediaRecorder.onstop = () => {
        // Update UI for completed recording
        isRecording = false;
        recordButton.textContent = 'Record';
        
        // Create blob for later playback
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        
        // Store the blob URL for later use
        if (lastRecordingURL) {
            URL.revokeObjectURL(lastRecordingURL);
        }
        lastRecordingURL = URL.createObjectURL(blob);
        
        // Show the playback button
        playbackButton.classList.remove('hidden');
    };
    
    // Start recording
    mediaRecorder.start();
    isRecording = true;
    recordButton.textContent = 'Stop';
}

/**
 * Show the recorded video for playback
 */
function showRecordedVideo() {
    if (lastRecordingURL) {
        // Switch to the recorded video
        videoElement.srcObject = null;
        videoElement.src = lastRecordingURL;
        
        // Enable audio for recording playback
        videoElement.muted = false;
        
        videoElement.play();
        
        // Disable record button while viewing the recording
        recordButton.disabled = true;
    }
}

/**
 * Stop ongoing recording
 */
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
    }
}

/**
 * Reset camera to preview mode (after viewing a recording)
 */
function resetCamera() {
    if (videoElement && stream) {
        // Important: First clear any existing source
        videoElement.pause();
        if (videoElement.src) {
            URL.revokeObjectURL(videoElement.src);
        }
        videoElement.src = '';
        
        // Then reattach the live stream
        videoElement.srcObject = stream;
        
        // Make sure the preview is muted to prevent feedback
        videoElement.muted = true;
        
        videoElement.play();
        
        // Reset UI
        recordButton.textContent = 'Record';
        recordButton.disabled = false;
        playbackButton.classList.add('hidden');
    }
}