import { Button, Input, Label, makeStyles, Tooltip, useId } from '@fluentui/react-components'
import { MoreHorizontal16Regular } from '@fluentui/react-icons'
import { open } from '@tauri-apps/plugin-dialog'
import { Command } from '@tauri-apps/plugin-shell'
import { useState } from 'react'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    gap: '20px',
    '> div > label': {
      display: 'inline-flex',
      width: '140px',
      marginLeft: '20px',
    },
  },
})

function App() {
  const [wechatPath, setWechatPath] = useState<string>('')
  const [wechatNumber, setWechatNumber] = useState<string>('2')
  const wechatPathInput = useId('wechat-path')
  const wechatNumberInput = useId('wechat-number')
  const styles = useStyles()

  const openFileDialog = async () => {
    const file = await open({
      multiple: false,
      directory: false,
    })
    setWechatPath(file ?? '')
  }

  const startMultiWechat = async () => {
    const result = Command.create('run-git-commit', ['commit', '-m', 'the commit message'])
    result.spawn().then((result) => {
      console.log(result)
    })
  }

  return (
    <form noValidate className={styles.root}>
      <div>
        <Label htmlFor={wechatPathInput}>请输入微信应用路径：</Label>
        <Input
          id={wechatPathInput}
          value={wechatPath}
          onChange={(_, data) => setWechatPath(data.value)}
        />
        <Tooltip content="浏览文件" relationship="label">
          <Button
            style={{ marginLeft: '4px' }}
            icon={<MoreHorizontal16Regular />}
            onClick={openFileDialog}
          />
        </Tooltip>
      </div>
      <div>
        <Label htmlFor={wechatNumberInput}>要启动的数量：</Label>
        <Input
          id={wechatNumberInput}
          type={'number'}
          value={wechatNumber}
          onChange={(_, data) => setWechatNumber(data.value)}
        />
      </div>
      <div>
        <Button style={{ marginLeft: '20px' }} appearance={'primary'} onClick={startMultiWechat}>
          开始执行
        </Button>
      </div>
    </form>
  )
}

export default App
