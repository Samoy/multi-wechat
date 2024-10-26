import { Button, Input, Label, makeStyles, Tooltip, useId } from '@fluentui/react-components'
import { MoreHorizontal16Regular } from '@fluentui/react-icons'
import { invoke } from '@tauri-apps/api/core'
import { ask, message, open } from '@tauri-apps/plugin-dialog'
import { exit } from '@tauri-apps/plugin-process'
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
    if (!wechatPath) {
      await message('请填写微信路径', { title: '提示', kind: 'warning' })
      return
    }
    const num = Number(wechatNumber)
    if (!Number.isInteger(num)) {
      await message('请填写1~10之间的整数', { title: '提示', kind: 'warning' })
    }
    invoke('start_multi_wechat', { path: wechatPath, num: Number(wechatNumber) })
      .then(async () => {
        const result = await ask('微信多开是否成功？', {
          title: '提示',
          kind: 'info',
        })
        if (result) {
          await exit()
        } else {
          await message('请检查微信路径是否正确！', { title: '提示', kind: 'info' })
        }
      })
      .catch((error) => {
        console.log('错误', error)
      })
  }

  return (
    <form noValidate className={styles.root}>
      <div>
        <Label htmlFor={wechatPathInput}>请输入微信应用路径：</Label>
        <Input
          autoFocus
          placeholder="请输入或者选择微信路径"
          id={wechatPathInput}
          style={{ width: '200px' }}
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
          min={1}
          max={10}
          id={wechatNumberInput}
          type={'number'}
          placeholder="请输入多开的数量"
          style={{ width: '200px' }}
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
