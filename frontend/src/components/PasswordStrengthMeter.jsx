import { Check, X } from 'lucide-react';
import React from 'react'

const PasswordCriteria = ({password}) => {
    const criteria = [
		{ label: "At least 6 characters", met: password.length >= 6 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

    return (
        <div className='mt-4 space-y-1'>
            {criteria.map((item,  i) => (
                <div key={item.label} className='flex items-center text-xs'>
                    {item.met ? (
                        <Check className='size-4 text-green-500 mr-2'/>
                    ) : (
                        <X className='size-4 text-gray-500 mr-2'/>
                    )}
                    <span className={item.met ? "text-green-500" : "text-gray-500"}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}



const PasswordStrengthMeter = ({password}) => {

    const getStrength = (password) => {
        let strength = 0;

        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        return strength;
    };

    const getStrengthText = (strength) => {

		if (strength === 0) return "Very Weak";
		if (strength === 1) return "Weak";
		if (strength === 2) return "Fair";
		if (strength === 3) return "Good";

		return "Strong";
	};

    const getColor = (strength) => {

		if (strength === 0) return "bg-red-400";
        if (strength === 1) return "bg-red-500";
		if (strength === 2) return "bg-orange-400";
		if (strength === 3) return "bg-yellow-400";

		return "bg-green-500";
	};

    const strength = getStrength(password);

    return (
        <div className='mt-2'>
            <div className='flex justify-between items-center mb-1'>
                <span className='text-xs text-gray-500'>
                    Password Strength
                </span>
                <span className='text-xs text-gray-500'>
                    {getStrengthText(strength)}
                </span>
            </div>
            <div className='flex space-x-1'>
                {[...Array(4)].map((_,i) => (
                    <div 
                        key={i} 
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300
                            ${i < strength ? getColor(strength) : "bg-gray-600"}
                        `}
                    />
                ))}
            </div>

            <PasswordCriteria password={password}/>
            
        </div>
    )
}

export default PasswordStrengthMeter
