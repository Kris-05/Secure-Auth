import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmailVerficationPage = () => {

  const [code, setCode] = useState(["","","","","","",]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const isLoading = false;

  const handleChange = (index, value) => {
    console.log(code);
    const newCode = [...code];

    // To Handle pasted content i.e 6 numbers wholly
    if (value.length > 1) {
      const pastedCode = value.slice(0,6).split(""); // convert them into an array of copied numbers
      for(let i=0; i<6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== ""); // checks which is the empty one
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex+1 : 5;
      inputRefs.current[focusIndex].focus();

    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the nxt input field, if enter a value
      if(value && index < 5){
        inputRefs.current[index + 1].focus();
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if(e.key === "Backspace" && !code[index] && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log(`Verification code submitted: ${verificationCode}`);
  }

  // Make submit button functional, when all are filled
  useEffect(()=>{
    if(code.every((digit) => digit !== "")){
      handleSubmit(new Event("submit"));
    }
  },[code]);

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
        <p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-between'>
            {code.map((digit, i) => (
              <input 
                key={i} type='text' maxLength='6' value={digit}
                ref={(el) => (inputRefs.current[i] = el)} // Assign each input element to the ref array
                onChange={(e) => handleChange(i, e.target.value)} // to handle multiple number paste & move focus to nxt input box
                onKeyDown={(e) => handleKeyDown(i, e)} // to move focus to the previous one, incase of backspace  
                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
              />
            ))}
          </div>
          <motion.button
            className='mt-5 w-full py-3 px-4 font-bold rounded-lg shadow-lg text-white transition duration-200
                bg-gradient-to-r from-green-500 to-emerald-600 
                hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50'
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type='submit'
            disabled={isLoading || code.some((digit) => !digit)}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default EmailVerficationPage
