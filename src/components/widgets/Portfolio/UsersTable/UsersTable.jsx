import {
  useCreatePortfolioUserMutation,
  useDeletePortfolioUserMutation,
  useGetPortfolioCustomerUsersQuery,
} from '@/api/portfolioApi';
import { selectPortfolioId, selectRole } from '@/features/auth/authSelector';
import { showError, showSuccess } from '@/utils/messageService';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AddUserModal } from '../Modal/AddUserModal';
import DeleteUserModal from '../Modal/DeleteUserModal';
import { getUserTableColumns } from '../tableColumns';

const UsersTable = ({ portfolioId }) => {
  const [users, setUsers] = useState([]);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [userForm] = Form.useForm();

  const roleId = useSelector(selectRole);
  const currentPortfolioId = useSelector(selectPortfolioId);
  const activePortfolioId = portfolioId || currentPortfolioId;

  // API hooks
  const { data: usersList, isLoading: usersLoading } = useGetPortfolioCustomerUsersQuery(
    { portfolioId: activePortfolioId, roleId },
    {
      skip: !activePortfolioId || !roleId,
    }
  );

  const [createUser, { isLoading: addingUser }] = useCreatePortfolioUserMutation();
  const [deleteUser, { isLoading: deletingUser }] = useDeletePortfolioUserMutation();

  // Load users from API
  useEffect(() => {
    if (usersList) {
      setUsers(usersList);
    }
  }, [usersList]);

  // Handlers
  const handleAddUser = async (values) => {
    try {
      const userData = {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.email,
        portfolio_id: activePortfolioId,
      };

      await createUser(userData).unwrap();
      userForm.resetFields();
      setAddUserModalVisible(false);
      showSuccess('User added successfully!');
    } catch (error) {
      console.error('Add user error:', error);
      showError('Failed to add user');
    }
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUserToDelete(user);
    setDeleteUserModalVisible(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUserToDelete) return;

    try {
      await deleteUser(selectedUserToDelete.id).unwrap();
      showSuccess('User deleted successfully!');
      setDeleteUserModalVisible(false);
      setSelectedUserToDelete(null);
    } catch (error) {
      console.error('Delete user error:', error);
      showError('Failed to delete user');
    }
  };

  const columns = getUserTableColumns(handleDeleteUserClick);

  return (
    <>
      <Card
        title={
          <Space>
            <UserOutlined />
            Users
          </Space>
        }
        extra={
          <Button
            variant="dashed"
            color="green"
            icon={<PlusOutlined />}
            onClick={() => setAddUserModalVisible(true)}
          >
            Add New User
          </Button>
        }
        className="page-card"
        style={{ marginBottom: 24 }}
        styles={{ body: { padding: '1px 0 0' } }}
      >
        <Spin spinning={usersLoading || addingUser || deletingUser} tip="Loading users...">
          <Table
            columns={columns}
            dataSource={users}
            rowKey={(record, index) => `user-${index}`}
            pagination={false}
          />
        </Spin>
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        open={addUserModalVisible}
        onCancel={() => {
          setAddUserModalVisible(false);
          userForm.resetFields();
        }}
        onSubmit={handleAddUser}
        loading={addingUser}
        form={userForm}
      />

      {/* Delete User Modal - Simple confirmation */}
      {deleteUserModalVisible && (
        <DeleteUserModal
          open={deleteUserModalVisible}
          onOk={handleDeleteUserConfirm}
          onCancel={() => {
            setDeleteUserModalVisible(false);
            setSelectedUserToDelete(null);
          }}
          confirmLoading={deletingUser}
          selectedUser={selectedUserToDelete}
        />
      )}
    </>
  );
};

export default UsersTable;
