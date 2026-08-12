# Ultra AI Assistant

A multi-AI interface that lets you add and use multiple downloaded AI models in one place. Search through your files and get responses from different AIs.

## Features

✨ **Multi-AI Management** - Add multiple AI models from your storage
🔀 **Two Modes**:
  - **Single AI Mode** - Chat with one AI at a time
  - **Super AI Mode** - Use multiple AIs simultaneously and compare responses

🔍 **File-Based AI** - Load AI models directly from your system
📁 **Local Storage** - All AI configurations saved locally in your browser

## How It Works

### Adding an AI Model

1. Click the **"+ Add AI"** button
2. A file picker will open
3. Navigate to your downloaded AI model file (supports `.json`, `.gguf`, `.bin`, `.model`, `.pt`, `.pth`)
4. Select the file
5. The AI will be added to your list automatically

### Using AI Models

1. **Single Mode**: Select one AI from the list on the left. A green dot indicates it's active.
2. **Super AI Mode**: Switch to "Super AI" in the header. Click AI badges to toggle multiple AIs on/off.
3. Type your message in the input field
4. Press Enter or click Send
5. Responses appear in the chat area

### File Structure

```
UltraAiAssistant/
├── index.html                 # Main interface
├── style.css                  # Styling
├── app.js                     # Application logic
├── utils.js                   # File utilities
├── ai-config-template.json    # Template for AI configs
└── README.md                  # This file
```

## AI Configuration Format

Create a JSON file for your AI with this structure:

```json
{
  "name": "My AI Model",
  "version": "1.0.0",
  "type": "local",
  "model": "model-name",
  "description": "Description of your AI",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 2048
  },
  "capabilities": ["text_generation", "qa"],
  "file_paths": ["./path/to/model.gguf"]
}
```

## Supported File Types

- `.json` - Configuration files
- `.gguf` - GGML format models (LLaMA, Mistral, etc.)
- `.bin` - PyTorch/TensorFlow models
- `.model` - Generic model files
- `.pt` / `.pth` - PyTorch models

## Browser Storage

- AI models and configurations are saved in browser localStorage
- Chat history is maintained during the session
- All data stored locally (no cloud sync)

## Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in message box

## Tips

- Test each AI individually before using Super AI mode
- Give your AI files descriptive names
- Organize your AI models in a dedicated folder
- Check the file picker is pointing to the correct location

## Future Features

- 🔗 Real AI backend integration
- 📊 Response comparison tools
- 💾 Conversation history export
- 🎨 Custom themes
- ⚙️ Advanced settings panel
