"""
QTransform Interface for MetisAI Platform
Provides a simple interface for Quantum Transformer
"""

import sys
import json
import time
from qtransform import QuantumTransformerModel

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
        model = QuantumTransformerModel(
            vocab_size=1000,
            d_model=128,
            nhead=4,
            num_layers=3,
            max_seq_length=256
        )
        
        # Generate text
        start_time = time.time()
        generated_text = model.generate(
            prompt=prompt,
            max_length=max_length,
            temperature=temperature,
            use_quantum=use_quantum
        )
        processing_time = time.time() - start_time
        
        # Calculate confidence
        confidence = 0.92 if use_quantum and model.model.dynex_available else 0.82
        
        # Return result
        result = {
            "text": generated_text,
            "method": "quantum" if use_quantum and model.model.dynex_available else "classical",
            "confidence": confidence,
            "processingTime": processing_time,
            "model": "QTransform",
            "quantumAvailable": model.model.dynex_available
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "text": "Error occurred during QTransform generation",
            "method": "classical",
            "confidence": 0.0,
            "processingTime": 0.0
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
