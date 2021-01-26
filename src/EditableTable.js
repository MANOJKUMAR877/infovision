import React, { useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from "antd";
const originData = [
  {
    id: 0,
    type: "Banner",
    armedia1: "v2.com/1",
    armedia2: "v2.com/12",
    twodtarget: "v2.com/13",
    turnleft: "v2.com/14",
    turnright: "v2.com/15",
    latitude: "45",
    longitude: "110",
    mascot: "<null>",
  },
  {
    id: 1,
    type: "Banner",
    armedia1: "v2.com/2",
    armedia2: "v2.com/22",
    twodtarget: "v2.com/23",
    turnleft: "v2.com/24",
    turnright: "v2.com/25",
    latitude: "45",
    longitude: "110",
    mascot: "<null>",
  },
  {
    id: 2,
    type: "Banner",
    armedia1: "v2.com/3",
    armedia2: "v2.com/32",
    twodtarget: "v2.com/33",
    turnleft: "v2.com/34",
    turnright: "v2.com/35",
    latitude: "45",
    longitude: "110",
    mascot: "<null>",
  },
  {
    id: 3,
    type: "Un Boxing",
    armedia1: "v2.com/4",
    armedia2: "v2.com/42",
    twodtarget: "v2.com/43",
    turnleft: "v2.com/44",
    turnright: "v2.com/45",
    latitude: "45",
    longitude: "110",
    mascot: "<null>",
  },
  {
    id: 4,
    type: "No Banner",
    armedia1: "v2.com/5",
    armedia2: "v2.com/52",
    twodtarget: "v2.com/53",
    turnleft: "v2.com/54",
    turnright: "v2.com/55",
    latitude: "45",
    longitude: "110",
    mascot: "yes",
  },
];

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
      {editing
        ? (
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
          )
        : children}
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
    },
    {
      title: "Ar Media 1- USDZ(url)",
      dataIndex: "turnleft",
      width: "15%",
      editable: true,
    },
    {
      title: "AR Media 1- GLB(url) ",
      dataIndex: "turnright",
      width: "15%",
      editable: true,
    },
    {
      title: "AR Media 2- USDZ(url) ",
      dataIndex: "armedia1",
      width: "15%",
      editable: true,
    },
    {
      title: "AR Media 2- GLB(url) ",
      dataIndex: "armedia2",
      width: "15%",
      editable: true,
    },
    {
      title: "2D Target (url)",
      dataIndex: "twodtarget",
      width: "15%",
      editable: true,
    },
    {
      title: "Mascot Mode(Y/N)",
      dataIndex: "mascot",
      width: "15%",
      editable: true,
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      width: "15%",
      editable: true,
    },
    {
      title: "longitude",
      dataIndex: "longitude",
      width: "15%",
      editable: true,
    },
    {
      title: "operation",
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
              <a>Cancel</a>
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
    <Form form={form} component={false}>
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
