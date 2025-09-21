"""
qdLLM Interface for MetisAI Platform
Provides a simple interface for the Quantum-Diffusion-LLM
"""

import sys
import json
import time
from qdllm import QuantumDiffusionLLM

def main():
    """Main interface function"""
    if len(sys.argv) < 5:
        print(json.dumps({
            "error": "Invalid arguments. Expected: prompt, max_length, temperature, use_quantum"
        }))
        return
    
    prompt = sys.argv[1]
    max_length = int(sys.argv[2])
    temperature = float(sys.argv[3])
    use_quantum = sys.argv[4].lower() == "true"
    
    try:
        # Initialize model
        model = QuantumDiffusionLLM(
            vocab_size=50257,
            hidden_size=768,
            num_layers=12,
            num_heads=12,
            quantum_threshold=0.7
        )
        
        # Generate text
        start_time = time.time()
        generated_text = model.generate(
            prompt=prompt,
            max_length=max_length,
            temperature=temperature,
            num_diffusion_steps=10
        )
        processing_time = time.time() - start_time
        
        # Calculate confidence (simplified)
        confidence = 0.85 if use_quantum and model.dynex_available else 0.75
        
        # Return result
        result = {
            "text": generated_text,
            "method": "quantum" if use_quantum and model.dynex_available else "classical",
            "confidence": confidence,
            "processingTime": processing_time,
            "model": "qdLLM",
            "quantumAvailable": model.dynex_available
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "text": "Error occurred during generation",
            "method": "classical",
            "confidence": 0.0,
            "processingTime": 0.0
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
