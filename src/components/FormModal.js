import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

function ProductModal({ show, handleClose, form, setForm, handleSave, editId }) {
  const [previewImages, setPreviewImages] = useState([]);

  // Saat file diubah, buat preview-nya
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  useEffect(() => {
    // Reset preview kalau modal ditutup
    if (!show) setPreviewImages([]);
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editId ? "Edit Produk" : "Tambah Produk"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nama Produk</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Foto Produk</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <div className="d-flex flex-wrap gap-2 mt-2">
              {previewImages.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt="preview"
                  width="80"
                  height="80"
                  rounded
                />
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
  );
}

export default ProductModal;
