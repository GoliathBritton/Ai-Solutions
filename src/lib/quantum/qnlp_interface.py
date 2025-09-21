"""
QNLP Interface for MetisAI Platform
Provides a simple interface for Quantum Natural Language Processing
"""

import sys
import json
import time
from qnlp import QuantumNLP

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
        qnlp = QuantumNLP(
            vocab_size=10000,
            embedding_dim=128,
            quantum_layers=3
        )
        
        # Process text
        start_time = time.time()
        
        # Example reference texts for similarity search
        reference_texts = [
            "Quantum computing is the future of technology.",
            "Artificial intelligence will transform our world.",
            "Machine learning algorithms are becoming more sophisticated.",
            "Natural language processing enables better human-computer interaction.",
            "Deep learning models require massive computational resources."
        ]
        
        # Perform different QNLP tasks
        similarity_results = qnlp.process_text(
            prompt, 
            task='similarity', 
            reference_texts=reference_texts
        )
        
        sentiment_results = qnlp.process_text(prompt, task='sentiment')
        
        classification_results = qnlp.process_text(prompt, task='classification')
        
        processing_time = time.time() - start_time
        
        # Calculate confidence
        confidence = 0.88 if use_quantum and qnlp.dynex_available else 0.78
        
        # Format results
        result_text = f"QNLP Analysis Results:\n\n"
        result_text += f"Similar Texts: {similarity_results.get('similar_texts', [])}\n"
        result_text += f"Sentiment: Positive {sentiment_results.get('positive', 0):.2f}, Negative {sentiment_results.get('negative', 0):.2f}\n"
        result_text += f"Classification: {classification_results.get('classification', {})}\n"
        result_text += f"Confidence: {sentiment_results.get('confidence', 0):.2f}"
        
        # Return result
        result = {
            "text": result_text,
            "method": "quantum" if use_quantum and qnlp.dynex_available else "classical",
            "confidence": confidence,
            "processingTime": processing_time,
            "model": "QNLP",
            "quantumAvailable": qnlp.dynex_available,
            "analysis": {
                "similarity": similarity_results,
                "sentiment": sentiment_results,
                "classification": classification_results
            }
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "text": "Error occurred during QNLP processing",
            "method": "classical",
            "confidence": 0.0,
            "processingTime": 0.0
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
