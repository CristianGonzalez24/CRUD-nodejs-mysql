import './LoadingSpinner.css'

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
    return (
        <div className={`loading-spinner-container ${size}`}>
            <div className={`loading-spinner ${color}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default LoadingSpinner