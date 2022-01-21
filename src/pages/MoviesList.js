import {
  List,
  Skeleton,
  PageHeader,
  Row,
  Descriptions,
  Button,
  Form,
  Modal,
  Rate,
  Input,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { createBrowserHistory } from "history";

const MoviesList = ({ ...props }) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("horizontal");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getList();
  }, []);

  const formItemLayout =
    formLayout === "vertical"
      ? {
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;
  const getList = async () => {
    const { data } = await axios.get("https://swapi.dev/api/films");
    setMovies(data.results);
    setLoading(false);
  };
  const validateForm = () => {
    form.validateFields().then((values) => {
      console.log(values);
      setOpen(false);
    });
  };
  return (
    <>
      {null == selectedFilm ? (
        <PageHeader
          className="site-page-header"
          title={null == selectedFilm ? "Movie List" : "Movie Detail "}
        />
      ) : (
        <PageHeader
          className="site-page-header"
          onBack={() => setSelectedFilm(null)}
          title={"Movie Detail "}
        />
      )}
      {selectedFilm == null ? (
        <List
          className="demo-loadmore-list"
          style={{ padding: "1vh" }}
          itemLayout="horizontal"
          dataSource={movies}
          renderItem={(item) => (
            <List.Item>
              <Skeleton avatar title={false} loading={loading} active>
                <List.Item.Meta
                  title={
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedFilm(item)}
                    >
                      <h2>{item.title}</h2>
                    </span>
                  }
                  description={item.opening_crawl}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      ) : (
        <Row>
          <Descriptions
            title={
              <>
                <h1>
                  <b>{selectedFilm.title}</b>
                </h1>
                <Button primary onClick={() => setOpen(true)}>
                  add rating
                </Button>
              </>
            }
            bordered
          >
            <Descriptions.Item label="Director">
              {selectedFilm.director}
            </Descriptions.Item>
            <Descriptions.Item label="Producer">
              {selectedFilm.producer}
            </Descriptions.Item>
            <Descriptions.Item label="Release date">
              {selectedFilm.release_date}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedFilm.opening_crawl}
            </Descriptions.Item>
          </Descriptions>
          <Modal
            title={selectedFilm.title}
            visible={open}
            onCancel={() => setOpen(false)}
            onOk={() => validateForm()}
          >
            <Form layout="vertical" form={form}>
              <Form.Item
                label="Rate"
                name="rate"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Rate />
              </Form.Item>
              <Form.Item
                label="Comment"
                name="comment"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Row>
      )}
    </>
  );
};

export default MoviesList;
