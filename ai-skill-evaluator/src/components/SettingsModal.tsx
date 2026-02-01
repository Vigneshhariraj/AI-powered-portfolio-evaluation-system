import { useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { fetchModels } from '@/services/api';


interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const SettingsModal = ({
  open,
  onOpenChange,
  apiKey,
  onApiKeyChange,
  selectedModel,
  onModelChange,
}: SettingsModalProps) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(selectedModel);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState('');

  // Sync local state when props change
  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setLocalModel(selectedModel);
  }, [selectedModel]);

  // Fetch models when API key changes
  useEffect(() => {
    if (localApiKey && localApiKey.trim().length > 0) {
      loadAvailableModels(localApiKey);
    } else {
      setAvailableModels([]);
      setModelError('');
    }
  }, [localApiKey]);

  const loadAvailableModels = async (key: string) => {
    setLoadingModels(true);
    setModelError('');
    
    try {
      const data = await fetchModels(key);
      
      if (data.error) {
        setModelError(data.error);
        setAvailableModels([]);
      } else if (data.models && data.models.length > 0) {
        setAvailableModels(data.models);
        // Set first model as default if current selection is not in the list
        if (!data.models.includes(localModel)) {
          setLocalModel(data.models[0]);
        }
      } else {
        setModelError('No models available');
        setAvailableModels([]);
      }
    } catch (err) {
      setModelError('Failed to fetch models');
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSave = () => {
    onApiKeyChange(localApiKey);
    onModelChange(localModel);
    onOpenChange(false);
  };

  const formatModelName = (modelName: string) => {
    // Convert "models/gemini-1.5-flash" to "Gemini 1.5 Flash"
    const name = modelName.replace('models/', '');
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your API key and model preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-foreground">
              Gemini API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground input-glow"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model" className="text-foreground">
              Model
            </Label>
            
            {loadingModels ? (
              <div className="flex items-center justify-center p-4 border border-border rounded-md bg-input">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading models...</span>
              </div>
            ) : modelError ? (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {modelError}
              </div>
            ) : availableModels.length > 0 ? (
              <Select value={localModel} onValueChange={setLocalModel}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {availableModels.map((model) => (
                    <SelectItem
                      key={model}
                      value={model}
                      className="text-foreground hover:bg-secondary"
                    >
                      {formatModelName(model)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 rounded-md bg-muted/30 border border-border text-muted-foreground text-sm">
                Enter a valid API key to load available models
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-foreground hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!localApiKey || availableModels.length === 0}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
