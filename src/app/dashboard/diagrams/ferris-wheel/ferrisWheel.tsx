import React from 'react';
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useFilter } from "@/app/contexts/filterContext";



interface FerrisWheelProps {
    colorscheme?: string;
}

const FerrisWheel: React.FC<FerrisWheelProps> = ({ colorscheme = 'blue' }) => {
    const { selectedNode } = useSelectedNode();
    const { filteredData } = useFilter();

    return (
        <div className="ferris-wheel">
            
        </div>
    );
};

export default FerrisWheel;