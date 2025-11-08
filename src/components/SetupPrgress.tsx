import { useSelector } from 'react-redux'

const SetupProgress = () => {
    const currentStep = useSelector((state: any) => state.setup.currentStep)
    return (
        <div className=''>
            <ol className="overflow-hidden space-y-8">
                <li className={`relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-${currentStep > 1 ? 'indigo-600' : 'gray-200'} after:inline-block after:absolute after:-bottom-11 after:left-4 lg:after:left-5`}>
                    <a href="#" className="flex items-center font-medium w-full">
                    <span className={`w-8 h-8 ${currentStep > 1 ? 'bg-indigo-600 border-transparent text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>
                            {currentStep > 1 ? (
                                <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : '1'}
                        </span>
                        <div className="block">
                            <h4 className={`text-lg ${currentStep > 1 ? 'text-indigo-600' : 'text-gray-900'} ${currentStep == 1 && 'text-green-600'}`}>Step 1</h4>
                            <span className="text-sm">Setup Sip Account</span>
                        </div>
                    </a>
                </li>
                {/* <li className={`relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-${currentStep > 2 ? 'indigo-600' : 'gray-200'} after:inline-block after:absolute after:-bottom-12 after:left-4 lg:after:left-5`}>
                    <a href="#" className="flex items-center font-medium w-full">
                        <span className={`w-8 h-8 ${currentStep > 2 ? 'bg-indigo-600 border-transparent text-white' : 'bg-indigo-50 border-gray-200 text-gray-900'} border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>
                            {currentStep > 2 ? (
                                <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : '2'}
                        </span>
                        <div className="block">
                            <h4 className={`text-lg ${currentStep > 2 ? 'text-indigo-600' : 'text-gray-900'}  ${currentStep == 2 && 'text-green-600'}`}>Step 2</h4>
                            <span className="text-sm">Campaign</span>
                        </div>
                    </a>
                </li> */}
                <li className={`relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-${currentStep > 2 ? 'indigo-600' : 'gray-200'} after:inline-block after:absolute after:-bottom-12 after:left-4 lg:after:left-5`}>
                    <a href="#" className="flex items-center font-medium w-full">
                        <span className={`w-8 h-8 ${currentStep > 2 ? 'bg-indigo-600 border-transparent text-white' : 'bg-indigo-50 border-gray-200 text-gray-900'} border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>
                            {currentStep > 2 ? (
                                <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : '2'}
                        </span>
                        <div className="block">
                            <h4 className={`text-lg ${currentStep > 2 ? 'text-indigo-600' : 'text-gray-900'}  ${currentStep == 2 && 'text-green-600'}`}>Step 2</h4>
                            <span className="text-sm">IVR File Upload</span>
                        </div>
                    </a>
                </li>
                <li className={`relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-${currentStep > 3 ? 'indigo-600' : 'gray-200'} after:inline-block after:absolute after:-bottom-12 after:left-4 lg:after:left-5`}>
                    <a href="#" className="flex items-center font-medium w-full">
                        <span className={`w-8 h-8 ${currentStep > 3 ? 'bg-indigo-600 border-transparent text-white' : 'bg-indigo-50 border-gray-200 text-gray-900'} border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>
                            {currentStep > 3 ? (
                                <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : '3'}
                        </span>
                        <div className="block">
                            <h4 className={`text-lg ${currentStep > 3 ? 'text-indigo-600' : 'text-gray-900'}  ${currentStep == 3 && 'text-green-600'}`}>Step 3</h4>
                            <span className="text-sm">Setup IVR Tree</span>
                        </div>
                    </a>
                </li>
                <li className="relative flex-1">
                    <a href="#" className="flex items-center font-medium w-full">
                        <span className={`w-8 h-8 ${currentStep == 4 ? 'bg-indigo-600 border-transparent text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>
                            {currentStep === 4 ? (
                                <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : '4'}
                        </span>
                        <div className="block">
                            <h4 className={`text-lg ${currentStep === 4 ? 'text-green-600' : 'text-gray-900'}`}>Step 4</h4>
                            <span className="text-sm">Summary</span>
                        </div>
                    </a>
                </li>
            </ol>
        </div>
    )
}

export default SetupProgress