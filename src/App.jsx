import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Typography, Space, Layout, theme } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { increment, decrement, incrementByAmount } from './store/slices/counterSlice'

const { Title, Text } = Typography
const { Content } = Layout

function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px' }}>
        <div style={{
          background: colorBgContainer,
          minHeight: 280,
          padding: 24,
          borderRadius: borderRadiusLG,
          textAlign: 'center'
        }}>
          <Title level={1}>Vite + React + Ant Design + Redux Toolkit</Title>

          <Card
            title="Redux Counter Example"
            style={{ maxWidth: 400, margin: '0 auto' }}
          >
            <Space direction="vertical" size="large">
              <Title level={2}>{count}</Title>

              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => dispatch(increment())}
                >
                  Increment
                </Button>

                <Button
                  icon={<MinusOutlined />}
                  onClick={() => dispatch(decrement())}
                >
                  Decrement
                </Button>

                <Button
                  type="dashed"
                  onClick={() => dispatch(incrementByAmount(5))}
                >
                  +5
                </Button>
              </Space>

              <Text type="secondary">
                Edit <code>src/App.jsx</code> and save to test HMR
              </Text>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default App
