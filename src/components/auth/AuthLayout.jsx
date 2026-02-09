import Image from 'next/image';

const AuthLayout = ({ children }) => {
  return (
    <div>
    
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-800">
      <div className="w-[90%] max-w-5xl h-[550px] bg-[rgb(26,27,32)] rounded-xl! shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT IMAGE */}
        <div className="m-4! hidden md:flex relative shadow-2xl! rounded-lg! overflow-hidden">
          <Image
            src="/sky.png"
            alt="Auth"
            fill
            className="object-cover"
            priority
            unoptimized
            onError={(e) => console.error('Failed to load sky.png:', e)}
          />
          <Image
            src="/Group.svg"
            alt="Group"
            width={144}
            height={64}
            className="absolute left-4 z-10"
            unoptimized
            onError={(e) => console.error('Failed to load Group.svg (left):', e)}
          />
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center p-8! relative">
          <Image
            src="/Group.svg"
            alt="Group"
            width={144}
            height={64}
            className="md:hidden absolute top-4 left-4"
            unoptimized
            onError={(e) => console.error('Failed to load Group.svg (mobile):', e)}
          />
          {children}
        </div>

      </div>
    </div>
    </div>
  );
};

export default AuthLayout;
