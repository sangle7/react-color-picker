
import React from 'react'
import { calculateColor, generateColor,gTarget, gPositionByColor, calculatePositionOnLine } from './utils'


const ColorInput = (props) => {
    const { onChange,labelText,v,step,type = 'number'  } = props
    return (
        <input value={v} onChange={onChange} step={step} className='testTxt green' type={type} />
    )
}

export class Colorpicker extends React.Component{
    constructor(props) {
        super(props)
        /*设置：排版（横/竖），样式（c1宽，高），开启input（hsl，rgb，hex）,是否可见*/
        this.config = {
            mode:"horizontal",
            hsl:true,   //render
            rgb:true,   //render
            hex:true,   //render
            visible: true,  //render
            ...this.props
        }
        this.state = {
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
                top:'-9px',
            },
            bgColor:'rgb(255,0,0)'
        }
    }

    initCanvas = (w,h) => {
        const gar2 = this.context2.createLinearGradient(0, 0, 0, h);
        gar2.addColorStop(0, 'rgb(255,0,0)');
        gar2.addColorStop(0.166, 'rgb(255,255,0)');
        gar2.addColorStop(0.33, 'rgb(0,255,0)');
        gar2.addColorStop(0.5, 'rgb(0,255,255)');
        gar2.addColorStop(0.67, 'rgb(0,0,255)');
        gar2.addColorStop(0.837, 'rgb(255,0,255)');
        gar2.addColorStop(1, 'rgb(255,0,0)');
        this.context2.fillStyle = gar2;
        this.context2.fillRect(0, 0, w,h);
    }


    componentDidMount(){
        console.log(this.config)
        this.context2 = this.canvasline.getContext('2d');
        this.canvasline.width = 10;
        this.canvasline.height = 400;
        this.initCanvas(this.canvasline.width,this.canvasline.height);
        /*生成默认的小球位置 */
        this.canvas.addEventListener('mousedown',e=>{
            this.isDragCanvas = true
        })
        this.canvaslinecontainer.addEventListener('mousedown',e=>{
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
        /*判断event是否在范围内 */
        const canvasToTop = this.canvas.getBoundingClientRect().top
        const canvasToLeft = this.canvas.getBoundingClientRect().left
        const x = gTarget(e.clientX,canvasToLeft,400),
        y = gTarget(e.clientY,canvasToTop,this.canvasline.height)

        let _bgcolor = this.state.bgColor,
            _bgred = parseInt(_bgcolor.slice(4, -1).split(',')[0]),
            _bggreen = parseInt(_bgcolor.slice(4, -1).split(',')[1]),
            _bgblue = parseInt(_bgcolor.slice(4, -1).split(',')[2]);
        const position = {}
        position.top = y- 9 - this.canvas.getBoundingClientRect().top + 'px';
        position.left = x - 9 - this.canvas.getBoundingClientRect().left+ 'px';
        const newColor = calculateColor(x, y, _bgred, _bggreen, _bgblue,this.state.color)
        this.setState({
            color: newColor,
            position,
        })
    }

    generateColor = (key,value) => {
        const color = this.state.color
        color[key] = key ==='hex' ? value : Number(value) 
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
        const position2 = {
            top:calculatePositionOnLine(bgColor) * this.canvasline.height - 9  +'px'
        }
        this.setState({
            color:newColor,
            bgColor,
            position,
            position2,
        })
    }

    changeBgColor = e => {
        /*判断event是否在范围内 */
        const canvaslineToTop = this.canvasline.getBoundingClientRect().top
        const y = gTarget(e.clientY,canvaslineToTop,this.canvasline.height)
        const { color,position } = this.state
        const position2 = {}
        let c = this.context2.getImageData(5, y-canvaslineToTop-0.5, 1, 1).data;
        position2.top = y - 9 -canvaslineToTop + 'px';
        const bgColor = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
        const newColor = calculateColor(parseInt(position.left)+9, parseInt(position.top)+9, c[0],c[1],c[2],color)
        this.setState({
            color:newColor,
            position2,
            bgColor
        })
    }

    render(){
        const { mode, hsl, rgb, hex, visible } = this.config
        // 这里 state 的 color 改变后，需要重新 render 两个canvas 所有的input
        const inputProps = (key) => ({
            labelText:key,
            v:this.state.color[key],
            onChange:e => this.generateColor(key,e.target.value)
        })

        const circlestyle = {
            ...this.state.position,
            backgroundColor: this.state.color.hex,
            height: '18px',
            width: '18px'
        }

        const circlestyle2 = {
            ...this.state.position2,
            backgroundColor: this.state.bgColor,
            height: '18px',
            width: '18px'
        }


        return (
            <div className={`rcp-container-${mode}`} style={{visibility:this.state.visible}}>
                <div className='rcp-canvas rcp-canvas-pr' ref={v =>this.canvas = v} onClick={this.generateFromClick} style={{backgroundColor:this.state.bgColor}}>
                    <div className='circle circle1' style={circlestyle}></div>
                    <div className='rcp-canvas ver'></div>
                    <div className='rcp-canvas hiz'></div>
                </div>
                <div className="rcp-canvas-pr rcp-canvasline-container" ref={v =>this.canvaslinecontainer = v} >
                    <canvas className="rcp-canvasline" ref={v =>this.canvasline = v} onClick={this.changeBgColor} ></canvas>
                    <div className='circle circle2' style={circlestyle2}></div>
                </div>
                <div className='rcp-control-base' style={{backgroundColor:this.state.color.hex}}>
                    {rgb && <div className='rcp-control-section'>
                        <label>rgb:</label>
                        <ColorInput {...inputProps('R')}/>,<ColorInput {...inputProps('G')}/>,<ColorInput {...inputProps('B')}/>
                    </div>}
                    {hsl && <div className='rcp-control-section'>
                        <ColorInput {...inputProps('H')} step={0.01}/>
                        <ColorInput {...inputProps('S')} step={0.01}/>
                        <ColorInput {...inputProps('L')} step={0.01}/>
                    </div>}
                    {hex && <div className='rcp-control-section'>
                        <ColorInput {...inputProps('hex')} type="text"/>
                    </div>}
                </div>
            </div>
        )
    }
}
