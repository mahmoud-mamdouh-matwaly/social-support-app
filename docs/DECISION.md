### 💡 Use of Environment Variables for Configurability:

To increase flexibility and maintainability, we decided to move key configuration parameters into environment variables:

### **Configuration Parameters**:
- **`MAX_TOKENS`**: Controls the maximum number of tokens per request. This helps manage API usage and prevent hitting token limits or quotas.
- **`MAX_RETRIES`**: Determines how many times a request should be retried upon failure. This gives us dynamic control based on request reliability or criticality.
- **`MODEL`**: Allows switching between different language models (e.g., gpt-4, gpt-4o, gpt-3.5-turbo) without modifying code. This provides flexibility for balancing cost, performance, or feature needs.

### **Benefits**:
- **Runtime Configuration**: Change behavior without code deployment
- **Environment-Specific Settings**: Different configs for dev, staging, production
- **Cost Management**: Easily adjust token limits and model selection
- **Performance Tuning**: Modify retry behavior based on infrastructure reliability
- **A/B Testing**: Switch models for different user segments
