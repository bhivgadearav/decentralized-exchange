import SwapCard from '../components/SwapCard';
import GradientBackground from '../components/GradientBackground';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function SwapPage() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black relative overflow-hidden">
        <GradientBackground />
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl font-bold text-white mb-2">Swap anytime,</h1>
          <h1 className="text-5xl font-bold text-white">anywhere.</h1>
        </div>
        <div className="relative z-10">
          <div className='flex justify-center'>
            <SwapCard />
          </div>
          <h6 className='font-bold text-white text-center mt-2'>Nothern Lights icon by <a target="_blank" className='underline' href="https://icons8.com">Icons8</a></h6>
          <h6 className='font-bold text-white text-center mt-2'>Designed And Developed By <a href="https://x.com/arav190720" className='underline'>Arav Bhivgade</a></h6>
          <div className="flex space-x-6 flex justify-center items-center mt-2">
            <a href="https://x.com/arav190720" className="text-white transition-all duration-200 ease-in-out transform hover:scale-110">
              <Twitter size={24} />
            </a>
            <a href="https://www.linkedin.com/in/aravbhivgade" className="text-white transition-all duration-200 ease-in-out transform hover:scale-110">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/bhivgadearav" className="text-white transition-all duration-200 ease-in-out transform hover:scale-110">
              <Github size={24} />
            </a>
            <a href="mailto:bhivgadearav0@gmail.com" className="text-white transition-all duration-200 ease-in-out transform hover:scale-110">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}