import './LoadingSpinner.css'

const LoadingSpinner = ({ size = 40, color = "#007bff" }) => {
    return (
        <div 
            className="loading-spinner-container" 
            style={{ width: size, height: size }} 
            aria-live="polite"
            aria-busy="true"
        >
            <div 
                className="loading-spinner" 
                style={{ 
                    width: size, 
                    height: size, 
                    borderColor: `${color} transparent ${color} transparent` 
                }} 
            />
        </div>
    )
}

export default LoadingSpinner