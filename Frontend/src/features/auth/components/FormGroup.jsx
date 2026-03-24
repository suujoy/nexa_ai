import React from "react";

const FormGroup = ({ label, type, placeholder, value, onChange, name }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="px-3 py-2 rounded-md border border-gray-300 
                   dark:border-gray-600 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default FormGroup;
