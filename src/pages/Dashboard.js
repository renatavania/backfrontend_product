import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    stock: 0,
    price: 0,
    description: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Gagal memuat data produk");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShow = (item = null) => {
    if (item) {
      setEditId(item.id);
      setForm({
        name: item.name || "",
        stock: item.stock || 0,
        price: item.price || 0,
        description: item.description || "",
        images: [],
      });

      if (item.avatar_url) {
        try {
          setPreviewImages(JSON.parse(item.avatar_url));
        } catch {
          setPreviewImages([item.avatar_url]);
        }
      } else {
        setPreviewImages([]);
      }
    } else {
      setEditId(null);
      setForm({ name: "", stock: 0, price: 0, description: "", images: [] });
      setPreviewImages([]);
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", form.name || "");
    formData.append("stock", form.stock || 0);
    formData.append("price", form.price || 0);
    formData.append("description", form.description || "");
    if (form.images.length > 0) {
      form.images.forEach((file) => formData.append("photos", file));
    }

    try {
      if (editId) {
        await api.put(`/products/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Produk berhasil diupdate");
      } else {
        await api.post("/products", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Produk berhasil ditambahkan");
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error("Save product error:", err.response?.data || err.message);
      toast.error("Gagal menyimpan produk");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
      toast.success("Produk berhasil dihapus");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error("Gagal menghapus produk");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Daftar Produk</h2>
          <Button variant="primary" onClick={() => handleShow()}>
            + Tambah Produk
          </Button>
        </div>

        <Table bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Nama</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Foto</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id}>
                  <td className="text-center">{item.id}</td>
                  <td>{item.name}</td>
                  <td className="text-center">{item.stock}</td>
                  <td className="text-center">Rp {item.price}</td>
                  <td>{item.description}</td>
                  <td>
                    {item.avatar_url ? (
                      <div className="d-flex flex-wrap gap-2">
                        {(() => {
                          try {
                            return JSON.parse(item.avatar_url).map((url, idx) => (
                              <Image key={idx} src={url} alt="product" width="60" height="60" rounded />
                            ));
                          } catch {
                            return <Image src={item.avatar_url} alt="product" width="60" height="60" rounded />;
                          }
                        })()}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(item)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Tidak ada produk
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? "Edit Produk" : "Tambah Produk"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stok</Form.Label>
                <Form.Control
                  type="number"
                  value={form.stock || 0}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Harga</Form.Label>
                <Form.Control
                  type="number"
                  value={form.price || 0}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Foto Produk</Form.Label>
                <Form.Control type="file" multiple onChange={handleFileChange} />
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {previewImages.map((src, i) => (
                    <Image key={i} src={src} alt="preview" width="80" height="80" rounded />
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
      </div>
    </div>
  );
}

export default Dashboard;
