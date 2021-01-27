import React, { useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Button,Space } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import originData from "./data";


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      armedia1: "",
      armedia2: "",
      twodtarget: "",
      turnleft: "",
      turnright: "",
      latitude: "",
      longitude: "",
      mascot: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const [searchText, updateSearchText] = useState('');
const [searchedColumn, updateSearchcolumn] = useState('');

 const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
               
                
                updateSearchText( selectedKeys[0])
                
                updateSearchcolumn(dataIndex)
              
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    updateSearchText( selectedKeys[0])
                
    updateSearchcolumn(dataIndex)
  };

 const handleReset = clearFilters => {
    clearFilters();
   updateSearchText('')
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      width: "15%",
      editable: false,
      ...getColumnSearchProps('type')
    },
    {
      title: "AR Media 1- USDZ(url)",
      dataIndex: "turnleft",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('turnleft')
    },
    {
      title: "AR Media 1- GLB(url) ",
      dataIndex: "turnright",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('turnright')
    },
    {
      title: "AR Media 2- USDZ(url) ",
      dataIndex: "armedia1",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('armedia1')
    },
    {
      title: "AR Media 2- GLB(url) ",
      dataIndex: "armedia2",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('armedia2')
    },
    {
      title: "2D Target (url)",
      dataIndex: "twodtarget",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('twotarget')
    },
    {
      title: "Mascot Mode(Y/N)",
      dataIndex: "mascot",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('mascot')
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('latitude')
    },
    {
      title: "longitude",
      dataIndex: "longitude",
      width: "15%",
      editable: true,
      ...getColumnSearchProps('longitude')
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span key={record.key}>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a style={{color:'red'}}>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false} >
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
       
      />
    </Form>
  );
};

export default EditableTable;
