import React, {Component} from "react";
import {NumberSquare} from "./NumberSquare";
import * as Constants from "./constants";
export class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.moveGrid=this.moveGrid.bind(this);
        this.createRow=this.createRow.bind(this);
        this.getRow=this.getRow.bind(this);
        this.getNumberSquare=this.getNumberSquare.bind(this);
        this.createNumberSquare=this.createNumberSquare.bind(this);
        this.startGame = this.startGame.bind(this);
        this.gridSize=4;
        this.initGridValues=this.initGridValues.bind(this);
        this.defaultPopulate=[11,12];
        this.myStorage = window.localStorage;
        this.highestScore = this.myStorage.getItem('highestScore') || 0;
        this.showSuccess=React.createRef();
        this.showEnd=React.createRef();
        this.startNewGame=this.startNewGame.bind(this);
        this.initGridValues();
    }

    initGridValues(reload){
        this.score=0;
        this.gameWon=false;
        let gridValues = [];
        const item = this.myStorage.getItem("gameGrid");
        let grids = item?item.split(","):[];
        let gridIncr=0;
        if(grids.length>0){
            for (let i = 1; i <= 4; ++i) {
                for (let j = 1; j <= 4; ++j) {
                    gridValues[i * 10 + j] = +grids[gridIncr++];
                }
            }
            this.score=+this.myStorage.getItem("currScore");
        }
        else {
            for (let i = 1; i <= 4; ++i) {
                for (let j = 1; j <= 4; ++j) {
                    gridValues[i * 10 + j] = 0;
                }
            }
            this.defaultPopulate.map((val) => gridValues[val] = 2);
            this.myStorage.setItem("gameGrid", gridValues);
            this.score=0;
        }
        if(reload)
            this.setState({gridVal:gridValues,currKey:this.props.keyPressed});
        else
            this.state={gridVal:gridValues,currKey:this.props.keyPressed};

    }

    moveGrid() {
        const gridVal = this.state.gridVal;
        this.changeGrid=false;
        if(this.state.currKey===Constants.LEFT_ID+""){
            this.moveLeft(gridVal);
        }
        else if(this.state.currKey===Constants.TOP_ID+""){
            this.moveTop(gridVal);
        }
        else if(this.state.currKey===Constants.RIGHT_ID+""){
            this.moveRight(gridVal);
        }
        else if(this.state.currKey===Constants.DOWN_ID+""){
            this.moveDown(gridVal);
        }
        if(this.changeGrid===true)
            this.generateRandomTile(gridVal);
        this.updateScore();
        this.props.onKeyPressed();
    }

    generateRandomTile(gridVal) {
        const uniqueID = this.generateUniqueID();
        const rowId = Number.parseInt(uniqueID.substr(0,1),10);
        const colId = Number.parseInt(uniqueID.substr(1,1),10);
        gridVal[uniqueID]=1;
        switch(this.state.currKey){
            case Constants.LEFT_ID+"":
                this.moveTogetherLeft(gridVal,rowId);
                break;
            case Constants.TOP_ID+"":
                this.moveTogetherTop(gridVal,colId);
                break;
            case Constants.RIGHT_ID+"":
                this.moveTogetherRight(gridVal,rowId);
                break;
            case Constants.DOWN_ID+"":
                this.moveTogetherDown(gridVal,colId);
                break;
            default:
                break;
        }
        const allIndexes = this.getAllIndexes(gridVal,0);
        const indexNumber = this.state.gridVal.findIndex((val)=>val===1);
        if( allIndexes.length<=4 )
        {
            const row = (""+indexNumber).substr(0,1);
            const col = (""+indexNumber).substr(1,1);
            let r1=row,r2=row,c1=col,c2=col,tempArr=[];
            while(--r1 >=1){
                if(this.state.gridVal[""+r1+col]>0) {
                        tempArr.push(this.state.gridVal[""+r1+col]);
                        break;
                }
            }
            while(++r2 <=this.gridSize){
                if(this.state.gridVal[""+r2+col]>0)
                {
                    tempArr.push(this.state.gridVal[""+r2+col]);
                    break;
                }
            }
            while (--c1 >= 1) {
                if(this.state.gridVal[""+row+c1] > 0)
                {
                    tempArr.push(this.state.gridVal["" + row+c1]);
                    break;
                }
            }
            while(++c2 <=this.gridSize){
                if(this.state.gridVal[""+row+c2]>0) {
                        tempArr.push(this.state.gridVal[""+row+c2]);
                        break;
                }
            }

            const allIndexes2 = this.getAllIndexes(tempArr,2);
            const allIndexes4 = this.getAllIndexes(tempArr,4);
            if(allIndexes2.length>allIndexes4.length || (allIndexes4.length === 0 && allIndexes2.length === 0))
                gridVal[indexNumber]=2;
            else
                gridVal[indexNumber]=4;
        }
        else
            gridVal[indexNumber]=2;
        this.setState({gridVal:gridVal});
    }

    getAllIndexes(arr, val) {
        let indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    generateUniqueID() {
        let location = this.uniqueLocation();
        let uniqueID = this.state.gridVal[location];
        if(uniqueID !== 0 ){
            location = this.generateUniqueID();
        }
        return location;
    }

    uniqueLocation() {
        return Math.floor(Math.random() * (5 - 1) + 1) + "" + Math.floor(Math.random() * (5 - 1) + 1)
    }

    moveLeft(gridVal) {
        for (let row = 1; row <= 4; row++) {
            for (let column = 1; column < 4; column++) {
                let gridElementVal = gridVal["" + row + column];
                if (gridElementVal !== 0) {
                    let tempColumn = column + 1;
                    let nextGridElemValue = gridVal["" + row + tempColumn];
                    while (nextGridElemValue === 0 && tempColumn < 4) {
                        tempColumn++;
                        nextGridElemValue = gridVal["" + row + tempColumn];
                    }

                    if (nextGridElemValue !== 0) {
                        if (gridElementVal === nextGridElemValue) {
                            gridVal["" + row + column] += gridElementVal;
                            this.score+= gridElementVal;
                            gridVal["" + row + tempColumn] = 0;
                            this.changeGrid=true;
                            column = tempColumn;
                        }
                    }
                }
            }
            this.moveTogetherLeft(gridVal, row);
        }
    }

    moveTogetherLeft(gridVal, row) {
        for (let col = 4; col > 1; col--) {
            let gridValElement = gridVal["" + row + col];
            if (gridValElement !== 0) {
                let tempCol = col - 1;
                let valElement = gridVal["" + row + tempCol];
                /*while (valElement !== 0 && tempCol > 1) {
                    tempCol--;
                    valElement = gridVal["" + row + tempCol]
                }*/
                if (valElement === 0) {
                    gridVal["" + row + tempCol] = gridValElement;
                    gridVal["" + row + col] = 0;
                    let moveCol = tempCol+1;
                    while (moveCol < 4) {
                        gridVal["" + row + moveCol] = gridVal["" + row + (moveCol+1)];
                        gridVal["" + row + (moveCol+1)] = 0;
                        moveCol++;
                    }
                    this.changeGrid = true;
                }
            }
        }
    }

    moveTop(gridVal) {
        for (let column = 1; column <= 4; column++) {
            for (let row = 1; row < 4; row++) {
                let gridElementVal = gridVal["" + row + column];
                if (gridElementVal !== 0) {
                    let tempColumn = row + 1;
                    let nextGridElemValue = gridVal[""  + tempColumn + column];
                    while (nextGridElemValue === 0 && tempColumn < 4) {
                        tempColumn++;
                        nextGridElemValue = gridVal["" + tempColumn + column ];
                    }

                    if (nextGridElemValue !== 0) {
                        if (gridElementVal === nextGridElemValue) {
                            gridVal["" + row + column ] += gridElementVal;
                            this.score+= gridElementVal;
                            gridVal["" + tempColumn + column ] = 0;
                            this.changeGrid=true;
                            row = tempColumn;
                        }
                    }
                }
            }
            this.moveTogetherTop(gridVal, column);
        }
    }

    moveTogetherTop(gridVal, column) {
        for (let col = 4; col > 1; col--) {
            let gridValElement = gridVal["" + col + column];
            if (gridValElement !== 0) {
                let tempCol = col - 1;
                let valElement = gridVal["" + tempCol + column];
  /*              while (valElement !== 0 && tempCol > 1) {
                    tempCol--;
                    valElement = gridVal["" + tempCol + column]
                }*/
                if (valElement === 0) {
                    gridVal["" + tempCol + column] = gridValElement;
                    gridVal["" + col + column] = 0;
                    let moveCol = tempCol+1;
                    while (moveCol < 4) {
                        gridVal[""  + moveCol+ column] = gridVal["" + (moveCol+1) + column];
                        gridVal[""+ (moveCol+1) + column ] = 0;
                        moveCol++;
                    }
                    this.changeGrid = true;
                }
            }
        }
    }

    moveRight(gridVal) {
        for (let row = 1; row <= 4; row++) {
            for (let column = 4; column > 1; column--) {
                let gridElementVal = gridVal["" + row + column];
                if (gridElementVal !== 0) {
                    let tempColumn = column - 1;
                    let nextGridElemValue = gridVal["" + row + tempColumn];
                    while (nextGridElemValue === 0 && tempColumn > 1) {
                        tempColumn--;
                        nextGridElemValue = gridVal["" + row + tempColumn];
                    }

                    if (nextGridElemValue !== 0) {
                        if (gridElementVal === nextGridElemValue) {
                            gridVal["" + row + column] += gridElementVal;
                            this.score+= gridElementVal;
                            gridVal["" + row + tempColumn] = 0;
                            this.changeGrid=true;
                            column = tempColumn;
                        }
                    }
                }
            }
            this.moveTogetherRight(gridVal, row);
        }
    }

    moveTogetherRight(gridVal, row) {
        for (let col = 1; col < 4; col++) {
            let gridValElement = gridVal["" + row + col];
            if (gridValElement !== 0) {
                let tempCol = col + 1;
                let valElement = gridVal["" + row + tempCol];
                /*while (valElement !== 0 && tempCol < 4) {
                    tempCol++;
                    valElement = gridVal["" + row + tempCol]
                }*/
                if (valElement === 0) {
                    gridVal["" + row + tempCol] = gridValElement;
                    gridVal["" + row + col] = 0;

                    let moveCol = tempCol-1;
                    while (moveCol > 1) {
                        gridVal["" + row + moveCol] = gridVal["" + row + (moveCol-1)];
                        gridVal["" + row + (moveCol-1)] = 0;
                        moveCol--;
                    }
                    this.changeGrid = true;
                }
            }
        }
    }

    moveDown(gridVal) {
        for (let row = 1; row <= 4; row++) {
            for (let column = 4; column > 1; column--) {
                let gridElementVal = gridVal["" + column+ row ];
                if (gridElementVal !== 0) {
                    let tempColumn = column - 1;
                    let nextGridElemValue = gridVal["" + tempColumn + row ];
                    while (nextGridElemValue === 0 && tempColumn > 1) {
                        tempColumn--;
                        nextGridElemValue = gridVal["" + tempColumn + row ];
                    }

                    if (nextGridElemValue !== 0) {
                        if (gridElementVal === nextGridElemValue) {
                            gridVal["" + column+ row ] += gridElementVal;
                            this.score+= gridElementVal;
                            gridVal["" + tempColumn+ row ] = 0;
                            this.changeGrid=true;
                            column = tempColumn;
                        }
                    }
                }
            }
            this.moveTogetherDown(gridVal, row);
        }
    }

    moveTogetherDown(gridVal, row) {
        for (let col = 1; col < 4; col++) {
            let gridValElement = gridVal["" + col + row];
            if (gridValElement !== 0) {
                let tempCol = col + 1;
                let valElement = gridVal["" + tempCol + row];
/*                while (valElement !== 0 && tempCol < 4) {
                    tempCol++;
                    valElement = gridVal["" + tempCol + row]
                }*/
                if (valElement === 0) {
                    gridVal["" + tempCol + row] = gridValElement;
                    gridVal["" + col + row] = 0;
                    let moveCol = tempCol-1;
                    while (moveCol > 1) {
                        gridVal[""  + moveCol+ row] = gridVal["" + (moveCol-1) + row];
                        gridVal[""+ (moveCol-1) + row ] = 0;
                        moveCol--;
                    }
                    this.changeGrid = true;
                }
            }
        }
    }

    static getDerivedStateFromProps(nextProps) {
        // do things with nextProps.someProp and prevState.cachedSomeProp
        return {
            currKey: nextProps.keyPressed
            // ... other derived state properties
        };
    }

    render() {
        const size=0;

        return (
            <div className="mainArea">
                <span className="score">
                    <div className="scoreSection">
                            <div className="currentScoreLabel">Current Score</div>
                            <div className="currentScore">{this.score}</div>
                            <div className="highestScoreLabel">Highest Score</div>
                            <div className="highestScore">{this.highestScore}</div>
                    </div>
                </span>
               <div className="gameContent">
                   <div className="container">
                    <div className="start"><div className="button" onClick={this.startGame}>Start</div></div>
                       <div className="success noShow" ref={this.showSuccess}>
                           <div className="successInfo">
                               <div>Congratulations...! </div>
                               <span>Go Ahead try 4096 ;)</span>
                           </div>
                           <div className="successBtn">
                               <span className="button" onClick={this.startGame}>Continue...</span>
                           </div>
                       </div>
                       <div className="success noShow" ref={this.showEnd}>
                           <div className="successInfo">
                               <div>Game Over ! </div>
                               <div>Your Score is : <strong>{this.score}</strong> </div>
                           </div>
                           <div className="successBtn">
                               <span className="button" onClick={this.startNewGame}>Start New</span>
                           </div>
                       </div>
                    {this.getRow(size)}
                </div>
               </div>
                <div className="gameExplanation">
                    <div className="explanation"><strong className="important">How to play:</strong> Use your <strong>arrow keys</strong> to
                        move
                        the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
                        <div className="margin--top-10">You <strong>win</strong> when any one tile reaches score
                            of <strong>2048</strong></div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps,prevState) {
        // Typical usage (don't forget to compare props):
        if (this.props.keyPressed !== prevProps.keyPressed &&
            (this.props.keyPressed === Constants.LEFT_ID+"" ||
            this.props.keyPressed === Constants.TOP_ID+"" ||
            this.props.keyPressed === Constants.RIGHT_ID+"" ||
            this.props.keyPressed === Constants.DOWN_ID+"")
        ) {
            //   this.setState({currKey:this.props.keyPressed})
            this.moveGrid();
        }
    }

    componentDidMount(){
        this.moveGrid();
    }

    getRow(size) {
        let retArr=[];
        this.numberArr=[];
        while(size<this.gridSize)
            retArr.push(this.createRow(++size));
        return retArr;
    }

    createRow(size) {
        return (<div id={"rw"+size} key={size}>
            {
                this.getNumberSquare(size)
            }
        </div>)
    }

    getNumberSquare(size) {
        let column=0,numArr=[];
        while(column<this.gridSize)
        {
            const items = this.createNumberSquare(size,++column);
            this.numberArr.push(items);
            numArr.push(items);
        }
        return numArr;
    }

    createNumberSquare(row, column) {
        return <NumberSquare id={"sq"+row+column} row={row} column={column} key={""+row+column} value={this.state.gridVal[""+row+column]} />
    }

    updateScore() {
        let grids = this.state.gridVal;
        let filtered = this.state.gridVal.filter(function (el) {
            return el || "null";
        });
        this.myStorage.setItem('gameGrid', filtered);
        this.myStorage.setItem('currScore',this.score);
        if(this.highestScore<this.score)
        {
            this.myStorage.setItem('highestScore',this.score);
            this.highestScore=this.score;
        }
        if(this.gameWon===false){
            if(this.state.gridVal && this.state.gridVal.findIndex(v=>v===2048)!==-1) {
                this.gameWon = true;
                this.showSuccess.current.classList.remove("noShow");
            }
        }
        if(this.state.gridVal && this.state.gridVal.findIndex(v=>v===0)===-1){
            let possibility = false;
            for(let i=1;i<=4;++i){
                for(let j=1;j<=4;++j){
                    let r1=i-1,r2=i+1,c1=j-1,c2=j+1;
                    if(r1>=1){
                        if (this.state.gridVal[i * 10 + j] === this.state.gridVal[r1 * 10 + j]) {
                            possibility = true;
                            break;
                        }
                    }
                    if(r2<=4){
                        if (this.state.gridVal[i * 10 + j] === this.state.gridVal[r2 * 10 + j]) {
                            possibility = true;
                            break;
                        }
                    }
                    if(c1>=1){
                        if (this.state.gridVal[i * 10 + j] === this.state.gridVal[i * 10 + c1]) {
                            possibility = true;
                            break;
                        }
                    }
                    if(c2<=4){
                        if (this.state.gridVal[i * 10 + j] === this.state.gridVal[i* 10 + c2]) {
                            possibility = true;
                            break;
                        }
                    }

                }
                if(possibility===true)
                    break;
            }
            if(possibility===false){
                this.showEnd.current.classList.remove("noShow");
            }
        }
    }
    startNewGame(e) {
        this.myStorage.setItem('gameGrid',[])
        this.initGridValues(true);
        e.target.parentElement.parentElement.classList.add("noShow");
    }
    startGame(e) {
        const elm = e.target.parentElement;
        elm.classList.contains("start")?elm.classList.add("noShow"):elm.parentElement.classList.add("noShow");
    }

}