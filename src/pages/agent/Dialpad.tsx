
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const Dialpad = ({ onDTMF, setDialpadNumber, isCalling, dialpadNumber }:
  { onDTMF: any, setDialpadNumber: any, isCalling: any, dialpadNumber: any }
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hoveredKey, setHoveredKey] = useState('');
  const dialpadRef = useRef<HTMLInputElement>(null);

  const toggleDialpad = () => {
    if (!isVisible) {
      dialpadRef.current && dialpadRef.current.focus()
    }
    setIsVisible(!isVisible);
  };

  const handleButtonClick = (value: any) => {
    setInputValue(prevValue => prevValue + value);
  };

  const handleKeyDown = (event: any) => {
    if (!isVisible) return;
    setInputValue(preValue => preValue + key)
    const { key } = event;
    if ((key >= '0' && key <= '9') || key === '*' || key === '#') {
      setInputValue(prevValue => prevValue + key);
      setHoveredKey(key);

    } else if (key === 'Backspace') {
      setInputValue(prevValue => prevValue.slice(0, -1));
    }
  };
  useEffect(() => {

    if (isCalling) {

      setDialpadNumber("")
      setInputValue("")
    } else {
      if (onDTMF) {
        onDTMF(inputValue?.at(-1));
      }
      setDialpadNumber(inputValue)
    }

  }, [inputValue, dialpadNumber])

  const handleKeyUp = () => {
    setHoveredKey('');
  };

  useEffect(() => {
    const dialpadElement = dialpadRef.current;

    if (dialpadElement) {
      dialpadElement.addEventListener('keydown', handleKeyDown);
      dialpadElement.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      if (dialpadElement) {
        dialpadElement.removeEventListener('keydown', handleKeyDown);
        dialpadElement.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [isVisible]);

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const renderButton = (value: string) => (
    <button
      key={value}
      className={`h-20 text-2xl text-gray-700 font-bold rounded-xl bg-gray-300 hover:bg-gray-400 ${hoveredKey === value ? 'bg-gray-400' : ''}`}
      onClick={() => handleButtonClick(value)}
      onMouseDown={() => setHoveredKey(value)}
      onMouseUp={() => setHoveredKey('')}
    >
      {value}
    </button>
  );

  return (
    <div>
      <button onClick={toggleDialpad} className="rounded-full bg-boxdark w-15 h-15">
        <Phone className='w-8 h-8 mx-auto text-white' />
      </button>
      <motion.div
        ref={dialpadRef}
        className="fixed bottom-0 transform -translate-y-1/2 rounded-lg shadow-lg -left-50 bg-boxdark "
        initial={{ x: 0 }}
        animate={{ x: isVisible ? "150%" : 0, y: "-5%" }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ width: '350px', height: 'auto' }}
        tabIndex={0}       >
        <div className="p-4">
          <input
            type="text"
            value={inputValue || ""}
            className="w-full h-20 text-2xl font-bold text-gray-700 bg-gray-300 rounded-xl ps-2 hover:border-none hover:ring-0 active:ring-0 focus:outline-none active:border-none"
            placeholder="Enter number"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          {buttons.map((value) => renderButton(value))}
        </div>
      </motion.div>
    </div>
  );
}
export default Dialpad;

