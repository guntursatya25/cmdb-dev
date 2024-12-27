const Toggle = ({ label, value, onToggle }) => {
    console.log('Toggle Value:', value);
    const handleToggle = () => {
        onToggle(!value);
    };

    return (
        <div className="flex items-center gap-2">
            <span>{label}</span>
            <div
                onClick={handleToggle}
                className={`relative inline-flex items-center h-6 w-12 cursor-pointer rounded-full ${
                    value ? 'bg-green-500' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`transform transition-transform duration-200 ease-in-out inline-block h-4 w-4 bg-white rounded-full ${
                        value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                ></span>
            </div>
        </div>
    );
};

export default Toggle;
