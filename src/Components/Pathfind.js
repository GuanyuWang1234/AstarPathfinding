import React, {useState, useEffect} from "react";
import Node from "./Node";
import "./Pathfind.css";
import Astar from "../AstarAlgo/Astar";

const rows = 70;
const cols = 100;  

const NODE_START_ROW = Math.ceil(rows / 2);
const NODE_START_COL = 0;
const NODE_End_ROW = Math.ceil(rows / 2);
const NODE_End_COL = cols - 1;


const Pathfind = () => {
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [VisitedNodes, setVisitedNodes] = useState([]);
    useEffect(() => {
        initializeGrid();
    }, []);

    const initializeGrid = () => {
        const grid = new Array(rows);

        for(let i = 0; i < cols; i++){
            grid[i] = new Array(cols);
        }

        createSpot(grid);

        setGrid(grid);

        addNieghbours(grid);

        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_End_ROW][NODE_End_COL];
        startNode.isWall = false;
        endNode.isWall = false;
        let path = Astar(startNode, endNode);
        setPath(path.path);
        setVisitedNodes(path.visitedNodes);
    };
    
    //CREATES THE SPOT
    const createSpot = (grid) =>{
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                grid[i][j] = new Spot(i, j);
            }
        }
    }; 

    const addNieghbours = (grid) => {
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                grid[i][j].addNeighbours(grid);
            }
        }
    }
    //SPOT CONSTRUCTOR 

    function Spot(i, j){
        this.x = i;
        this.y = j;
        this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEnd = this.x === NODE_End_ROW && this.y === NODE_End_COL;
        this.g = 0
        this.f = 0;
        this.h = 0;
        this.neighbours = [];
        this.isWall = false;
        if (Math.random(1) < 0.2){
            this.isWall = true;
        }
        this.previous = undefined ;
        this.addNeighbours = function(grid){
            let i = this.x;
            let j = this.y; 
            if (i > 0) this.neighbours.push(grid[i - 1][j]);
            if (i < rows - 1) this.neighbours.push(grid[i + 1][j]);
            if (j > 0) this.neighbours.push(grid[i][j - 1]);
            if (j < cols - 1) this.neighbours.push(grid[i][j + 1]);

        }
    };
    //Grid with Node

    const gridwithNode = (
        <div> 
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="RowWrapper">
                         
                        {row.map((col, colIndex) => {
                            const {isStart, isEnd, isWall} = col;
                            
                            return <Node key={colIndex} isStart={isStart} isEnd={isEnd} row={rowIndex} col={colIndex}
                            isWall={isWall} />;
                        })}
                        
                    </div>
                
                );
            }
            )
        }
        </div>
    );

   console.log(Path);
     
    const visualizeShortestPath = (shortestPathNodes) =>{
        for (let i = 0; i < shortestPathNodes.length; i++){
            
            setTimeout(() => {
                const node = shortestPathNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path"
            }, 10* i)
            
        }
    }
    const visualizePath = () => {
        for (let i = 0; i <= VisitedNodes.length; i++){
            if (i === VisitedNodes.length)
            {
                setTimeout(() => {
                    visualizeShortestPath(Path);
                }, 10* i)
            }
            else{
                setTimeout(() => {
                const node = VisitedNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-visited";
            }, 10 * i)
            }
        }
   }
    return (
        <div className="Wrapper">
            <button onClick={visualizePath}> Visualize Path </button> 
            <h1>Pathfinding Visualize2r </h1>
            
            {gridwithNode}
        </div>
    );
};

export default Pathfind