# 分割区样式

风格区样式主要改了一下几处

（1）设置了页面背景色

在工程\src\layout\index.less文件中修改.page-layout背景色为#EBECF0

（2）在app.less中添加了table-header、table-header-child样式，

主表中使用table-header样式类，子表中使用table-header-child样式类

## 1.主表中使用方法

以如下代码为例

	<div className='table-header'>
		<Button iconType="uf uf-plus" className="ml8"
					onClick={() => {
						this.onShowModal('passenger', 0)
					}}
		>新增</Button>
    </div>

按钮外层div使用table-header样式类

## 2.子表中使用方法

以多子表代码为例

	<div className = 'tabel-header-wrap'>
		<Tabs
			defaultActiveKey={tabKey}
			onChange={this.onChangeTab}
			tabBarStyle="upborder"
			className="demo1-tabs"
		>
			<TabPane tab='紧急联系人' key="1">
				<div className='table-header-child'>
					<Button iconType="uf uf-plus" className="ml8"
								onClick={() => {
									this.onShowModal('emergency', 0)
								}}
					>新增</BtnIcon>
				</div>
				<Grid/>
			</TabPane>
			<TabPane tab='订票信息' key="2">
				<div className='table-header-child' >
					<Button iconType="uf uf-plus" className="ml8"
								onClick={() => {
									this.onShowModal('traveling', 0)
								}}
					>新增</BtnIcon>
				</div>

				<Grid />
			</TabPane>

			<TabPane tab='附件管理' key="3"></TabPane>
		</Tabs>
	</div>
	
因为当前的子表采用tabs,因此添加section样式分为两步

（1）在tabs最外层添加tabel-header-wrap样式类

（2）在TabPane中的按钮外层div中添加table-header-child样式类