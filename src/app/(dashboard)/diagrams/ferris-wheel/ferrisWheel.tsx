import React from 'react';
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useFilter } from "@/app/contexts/filterContext";



interface FerrisWheelProps {
    colorscheme?: string;
}

const FerrisWheel: React.FC<FerrisWheelProps> = ({ colorscheme = 'blue' }) => {
    // Context for storing the node the user selects
    const { selectedNode, setSelectedNode } = useSelectedNode();
    // Contexts used for filtering
    const { filteredDiagram } = useFilter();

    return (
        <div className="ferris-wheel">
            
        </div>
    );
};

export default FerrisWheel;