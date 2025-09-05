import { PlusOutlined, MinusOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Typography, Space, Row, Col, Statistic, Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../../store/slices/counterSlice';

const { Title, Text } = Typography;

const CounterDemoPage = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleReset = () => {
    // Reset to 0 by decrementing current value
    dispatch(incrementByAmount(-count));
  };

  return (
    <div>
      <Title level={2}>Redux Counter Demo</Title>
      <Text type='secondary'>This page demonstrates Redux Toolkit state management with a simple counter.</Text>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        {/* Main Counter */}
        <Col xs={24} lg={12}>
          <Card title='Counter Control' style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '32px' }}>
              <Statistic
                title='Current Count'
                value={count}
                valueStyle={{
                  fontSize: '48px',
                  color: count > 0 ? '#52c41a' : count < 0 ? '#ff4d4f' : '#1890ff',
                }}
              />
            </div>

            <Space wrap size='large'>
              <Button type='primary' size='large' icon={<PlusOutlined />} onClick={() => dispatch(increment())}>
                Increment
              </Button>

              <Button size='large' icon={<MinusOutlined />} onClick={() => dispatch(decrement())}>
                Decrement
              </Button>

              <Button type='dashed' size='large' icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
            </Space>

            <Divider />

            <Title level={4}>Quick Actions</Title>
            <Space wrap>
              <Button type='primary' ghost onClick={() => dispatch(incrementByAmount(5))}>
                +5
              </Button>
              <Button type='primary' ghost onClick={() => dispatch(incrementByAmount(10))}>
                +10
              </Button>
              <Button
                type='primary'
                ghost
                onClick={() => dispatch(incrementByAmount(100))}
                icon={<ThunderboltOutlined />}
              >
                +100
              </Button>
              <Button onClick={() => dispatch(incrementByAmount(-5))}>-5</Button>
              <Button onClick={() => dispatch(incrementByAmount(-10))}>-10</Button>
            </Space>
          </Card>
        </Col>

        {/* Counter Stats */}
        <Col xs={24} lg={12}>
          <Card title='Counter Statistics'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title='Absolute Value' value={Math.abs(count)} valueStyle={{ color: '#1890ff' }} />
              </Col>
              <Col span={12}>
                <Statistic
                  title='Sign'
                  value={count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}
                  valueStyle={{
                    color: count > 0 ? '#52c41a' : count < 0 ? '#ff4d4f' : '#faad14',
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic title='Squared' value={count * count} valueStyle={{ color: '#722ed1' }} />
              </Col>
              <Col span={12}>
                <Statistic title='Is Even' value={count % 2 === 0 ? 'Yes' : 'No'} valueStyle={{ color: '#13c2c2' }} />
              </Col>
            </Row>

            <Divider />

            <div>
              <Title level={5}>About This Demo</Title>
              <Text type='secondary'>This counter demonstrates Redux Toolkit's slice pattern with:</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>
                  <Text type='secondary'>Immutable state updates</Text>
                </li>
                <li>
                  <Text type='secondary'>Action creators</Text>
                </li>
                <li>
                  <Text type='secondary'>useSelector for reading state</Text>
                </li>
                <li>
                  <Text type='secondary'>useDispatch for dispatching actions</Text>
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Code Example */}
      <Row style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title='Redux Code Example'>
            <Text code style={{ fontSize: '12px' }}>
              {`// Increment action
dispatch(increment())

// Decrement action  
dispatch(decrement())

// Increment by specific amount
dispatch(incrementByAmount(5))

// Reading state
const count = useSelector((state) => state.counter.value)`}
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CounterDemoPage;
