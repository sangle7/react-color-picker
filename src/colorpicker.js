
import React from 'react'
import { calculateColor, generateColor, gPositionByColor } from './utils'


const ColorInput = (props) => {
    const { onChange,labelText,v,step } = props
    return (
        <label className='colorpickerLabel'>{labelText}:
            <input value={v} onChange={onChange} step={step} className='testTxt green' type='number'/>
        </label>
    )
}

export class Colorpicker extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible,
            color:{
                R:255,
                G:0,
                B:0,
                H:0,
                L:1,
                S:0.5,
                hex:'#ff0000'
            },
            position:{
                top:'-9px',
                left:'391px'
            },
            position2:{
                top:'-9px'
            },
            bgColor:'rgb(255,0,0)'
        }
    }

    initCanvas = () => {
        const gar2 = this.context2.createLinearGradient(0, 0, 0, 400);
        gar2.addColorStop(0, 'rgb(255,0,0)');
        gar2.addColorStop(0.166, 'rgb(255,255,0)');
        gar2.addColorStop(0.33, 'rgb(0,255,0)');
        gar2.addColorStop(0.5, 'rgb(0,255,255)');
        gar2.addColorStop(0.67, 'rgb(0,0,255)');
        gar2.addColorStop(0.837, 'rgb(255,0,255)');
        gar2.addColorStop(1, 'rgb(255,0,0)');
        this.context2.fillStyle = gar2;
        this.context2.fillRect(0, 0, 20, 400);
    }


    componentDidMount(){
        this.context2 = this.canvasline.getContext('2d');
        this.canvasline.width = 20;
        this.canvasline.height = 400;
        this.initCanvas();
        /*生成默认的小球位置 */
        this.canvas.addEventListener('mousedown',e=>{
            this.isDragCanvas = true
        })
        this.canvasline.addEventListener('mousedown',e=>{
            this.isDragCanvasLine = true
        })
        document.addEventListener('mouseup',e=>{
            this.isDragCanvas = false
            this.isDragCanvasLine = false
        })
        document.addEventListener('mousemove',e=>{
            if(this.isDragCanvas){
                this.generateFromClick(e)
            } else if (this.isDragCanvasLine){
                this.changeBgColor(e)
            }
        })
    }

    generateFromClick = e => {
        let _bgcolor = this.state.bgColor,
            _bgred = parseInt(_bgcolor.slice(4, -1).split(',')[0]),
            _bggreen = parseInt(_bgcolor.slice(4, -1).split(',')[1]),
            _bgblue = parseInt(_bgcolor.slice(4, -1).split(',')[2]);
        const position = {}
        position.top = e.clientY - 9 - this.canvas.getBoundingClientRect().top + 'px';
        position.left = e.clientX - 9 - this.canvas.getBoundingClientRect().left+ 'px';
        const newColor = calculateColor(e.clientX, e.clientY, _bgred, _bggreen, _bgblue,this.state.color)
        this.setState({
            color: newColor,
            position,
        })
    }

    generateColor = (key,value) => {
        const color = this.state.color
        color[key] = Number(value);
        let newColor
        switch(key){
            case 'R':
            case 'G':
            case 'B':
                newColor = generateColor('rgb',color)
            break;
            case 'H':
            case 'S':
            case 'L':
                newColor = generateColor('hls',color)
            break;
            case 'hex':
                newColor = generateColor('hex',color)
            break;
            default:
        }
        /*根据color计算小圈的位置 */
        const [bgColor,position] = gPositionByColor(newColor)
        this.setState({
            color:newColor,
            bgColor,
            position,
        })
    }

    changeBgColor = e => {
        const { color,position } = this.state
        const position2 = {}
        let c = this.context2.getImageData(10, e.clientY, 1, 1).data;
        position2.top = e.clientY - 9 -this.canvasline.getBoundingClientRect().top + 'px';
        const bgColor = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
        const newColor = calculateColor(parseInt(position.left)+9, parseInt(position.top)+9, c[0],c[1],c[2],color)
        this.setState({
            color:newColor,
            position2,
            bgColor
        })
    }

    render(){
        // 这里 state 的 color 改变后，需要重新 render 两个canvas 所有的input
        const inputProps = (key) => ({
            labelText:key,
            v:this.state.color[key],
            onChange:e => this.generateColor(key,e.target.value)
        })

        return (
            <div className="rcp-container" style={{visibility:this.state.visible}}>
                <div className='rcp-canvas rcp-canvas-pr' ref={v =>this.canvas = v} onClick={this.generateFromClick} style={{backgroundColor:this.state.bgColor}}>
                    <div className='circle circle1' style={this.state.position}></div>
                    <div className='rcp-canvas ver'></div>
                    <div className='rcp-canvas hiz'></div>
                </div>
                <div className="rcp-canvas-pr rcp-canvasline-container" ref={v =>this.canvaslinecontainer = v} >
                    <canvas ref={v =>this.canvasline = v} onClick={this.changeBgColor} ></canvas>
                    <div className='circle circle2' style={this.state.position2}></div>
                </div>
                <div className='rcp-control-base'>
                    <div className='rcp-preview' style={{backgroundColor:this.state.color.hex}}></div>
                    <div className='rcp-control-section'>
                        <ColorInput {...inputProps('R')}/>
                        <ColorInput {...inputProps('G')}/>
                        <ColorInput {...inputProps('B')}/>
                    </div>
                    <div className='rcp-control-section'>
                        <ColorInput {...inputProps('H')} step={0.01}/>
                        <ColorInput {...inputProps('S')} step={0.01}/>
                        <ColorInput {...inputProps('L')} step={0.01}/>
                    </div>
                </div>
            </div>
        )
    }
}
