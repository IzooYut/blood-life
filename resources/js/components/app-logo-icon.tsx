import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        
                <div className="flex justify-center mb-6">
                    <img
                        src="/width-150px.png"
                        alt="Donation Life"
                        className="h-14 sm:h-16 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                    />
                </div>
    );
}
