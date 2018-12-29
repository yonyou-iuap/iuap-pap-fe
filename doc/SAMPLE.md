
## iuap 前端项目组件示例

 > 所有组件示例的展示和使用


### 导出示例代码

> 导出功能目前需要配合 bee-complex-grid 功能一起使用

```js

  export = ()=>{
    this.refs.grid.exportExcel();
  }

<Button colors="primary"  className="save-btn" size="sm" onClick={this.export}>导出Excel</Button>

<Grid
    data={list}
    ref="grid"                //Grid 对象
    sheetName="demo4 导出模板"  //sheet 的名称
    sheetIsRowFilter={true}   //是否需要设置每一条数据的(高、是否显示)
    sheetHeader={{height:30,ifshow:false}}  //单独设置sheetHeader的属性(高、是否显示)
  />


 column = [
        {

            ifshow:false,
            }

```

### pop示例代码

```js

import PopDialog from 'components/Pop';


    //确认回调函数
    configFn = ()=>{
        console.log("configFn");
        this.close();
    }

    //取消回调函数
    cancelFn = ()=>{
        console.log("cancelFn");
        this.close();
    }

    close = ()=>{
        this.setState({
            show:false
        })
    }

    render() {

      let btns = [
            {
                label: '确定',
                fun: this.configFn,
            },
            {
                label: '取消',
                fun: this.cancelFn,
            }
        ];


        <PopDialog
            className="xxx_dialog_modal" // 特殊弹框需要覆盖样式的，可以加前缀
            show={ this.state.show } //默认是否显示，可选属性
            title="标题"
            close={this.cancelFn}
            btnRender = {(<Button colors="primary" onClick={()=>{this.setState({show:true})}}> 打开弹框 </Button>)}
            btns={btns}>

            <p>弹框内容</p>
        </PopDialog>
    }

```

### alert 示例代码

```js

import Alert from 'components/Alert';

render() {
    return(

        <Alert
            className="xxx_dialog_modal" // 设置弹框样式
            show={ this.state.show  } //默认是否显示，可选属性
            context="是否要删除 ?"
        >
            <Button colors="primary" onClick={()=>{this.setState({show:true})}}> 弹出警告框 </Button>
        </Alert>

    )}

```
### button 示例代码


