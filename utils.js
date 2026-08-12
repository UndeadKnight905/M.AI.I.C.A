// Made by UneadKnight905

// File Utilities for AI File Management

// Check if running in Electron/Node environment
const isElectron = typeof require !== 'undefined' && typeof window !== 'undefined';

/**
 * Load AI configuration from a JSON file
 * @param {File} file - The file object from file picker
 * @returns {Promise<Object>} - Parsed AI configuration
 */
async function loadAIConfig(file) {
    try {
        const text = await file.text();
        return JSON.parse(text);
    } catch (error) {
        console.error('Error loading AI config:', error);
        return null;
    }
}

/**
 * Search files in a directory (browser limitation - requires user selection)
 * @param {string} query - Search query/keyword
 * @param {Array<File>} files - Files to search through
 * @returns {Array<Object>} - Matching files with snippets
 */
function searchInFiles(query, files) {
    const results = [];
    const queryLower = query.toLowerCase();

    files.forEach(file => {
        // Search in filename
        if (file.name.toLowerCase().includes(queryLower)) {
            results.push({
                fileName: file.name,
                matchType: 'filename',
                relevance: 'high'
            });
        }
    });

    return results;
}

/**
 * Extract text from file content
 * @param {File} file - File to extract from
 * @returns {Promise<string>} - File content as text
 */
async function extractTextFromFile(file) {
    try {
        if (file.type.includes('text') || file.name.endsWith('.json') || file.name.endsWith('.txt')) {
            return await file.text();
        }
        return '';
    } catch (error) {
        console.error('Error extracting text:', error);
        return '';
    }
}

/**
 * Get file info
 * @param {File} file - File to get info from
 * @returns {Object} - File information
 */
function getFileInfo(file) {
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
        path: file.webkitRelativePath || file.name
    };
}

/**
 * Format file size to readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Simulate AI response by searching through loaded file content
 * @param {string} query - User query
 * @param {string} fileContent - Content from AI model file
 * @param {string} aiName - AI model name
 * @returns {Promise<string>} - Simulated AI response
 */
async function getAIResponse(query, fileContent, aiName) {
    // This is a placeholder - in real implementation, this would:
    // 1. Parse the file content as an AI model
    // 2. Run inference
    // 3. Return actual AI response
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const response = `${aiName} Response: Based on your query "${query}", here's the result...`;
            resolve(response);
        }, 500);
    });
}
