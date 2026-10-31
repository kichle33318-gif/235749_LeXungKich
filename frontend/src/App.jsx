import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './config';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    deviceType: '',
    room: '',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // 1. Lấy danh sách thiết bị / Tìm kiếm
  const fetchDevices = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_URL}?search=${keyword}` : API_URL;
      const res = await axios.get(url);
      setDevices(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách thiết bị từ backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Xử lý ô Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(search);
  };

  // Xử lý thay đổi ô nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Thêm hoặc Cập nhật thiết bị
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, formData);
        setMessage('Cập nhật thông tin thiết bị thành công!');
      } else {
        await axios.post(API_URL, formData);
        setMessage('Thêm thiết bị mới thành công!');
      }
      resetForm();
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thiết bị.');
    }
  };

  // 3. Chuẩn bị dữ liệu để Sửa
  const handleEdit = (device) => {
    setIsEditing(true);
    setEditId(device._id);
    setFormData({
      deviceId: device.deviceId || '',
      name: device.name || '',
      deviceType: device.deviceType || '',
      room: device.room || '',
      brand: device.brand || '',
      model: device.model || '',
      quantity: device.quantity || 1,
      status: device.status || 'Đang sử dụng',
      description: device.description || ''
    });
  };

  // 4. Xóa thiết bị
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) return;
    setError('');
    setMessage('');
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Xóa thiết bị thành công!');
      fetchDevices();
    } catch (err) {
      setError('Lỗi khi xóa thiết bị.');
    }
  };

  // 5. Xem chi tiết thiết bị
  const handleViewDetail = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setSelectedDevice(res.data);
    } catch (err) {
      setError('Không thể lấy chi tiết thiết bị.');
    }
  };

  const resetForm = () => {
    setFormData({
      deviceId: '',
      name: '',
      deviceType: '',
      room: '',
      brand: '',
      model: '',
      quantity: 1,
      status: 'Đang sử dụng',
      description: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Quản Lý Thiết Bị Phòng Học</h2>

      {/* Thông báo Lỗi / Thành công */}
      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px' }}>{error}</div>}

      {/* Form Thêm / Cập nhật */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{isEditing ? 'Cập Nhật Thiết Bị' : 'Thêm Thiết Bị Mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" name="deviceId" placeholder="Mã thiết bị (*)" value={formData.deviceId} onChange={handleChange} required disabled={isEditing} />
          <input type="text" name="name" placeholder="Tên thiết bị (*)" value={formData.name} onChange={handleChange} required />
          <input type="text" name="deviceType" placeholder="Loại thiết bị (*)" value={formData.deviceType} onChange={handleChange} required />
          <input type="text" name="room" placeholder="Phòng học (*)" value={formData.room} onChange={handleChange} required />
          <input type="text" name="brand" placeholder="Hãng sản xuất" value={formData.brand} onChange={handleChange} />
          <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} />
          <input type="number" name="quantity" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} min="1" required />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Đang sử dụng">Đang sử dụng</option>
            <option value="Hư hỏng">Hư hỏng</option>
            <option value="Đang sửa chữa">Đang sửa chữa</option>
            <option value="Ngừng sử dụng">Ngừng sử dụng</option>
          </select>
        </div>
        <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} style={{ width: '100%', marginTop: '10px', height: '60px' }} />
        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ padding: '8px 15px', marginRight: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {isEditing ? 'Lưu Cập Nhật' : 'Thêm Mới'}
          </button>
          {isEditing && <button type="button" onClick={resetForm} style={{ padding: '8px 15px', cursor: 'pointer' }}>Hủy</button>}
        </div>
      </form>

      {/* Thanh Tìm Kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên, loại hoặc phòng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchDevices(''); }} style={{ padding: '8px 15px', cursor: 'pointer' }}>Làm mới</button>
      </form>

      {/* Trạng thái Đang tải */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Mã TB</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th>Phòng</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy thiết bị nào</td></tr>
            ) : (
              devices.map((item) => (
                <tr key={item._id}>
                  <td>{item.deviceId}</td>
                  <td>{item.name}</td>
                  <td>{item.deviceType}</td>
                  <td>{item.room}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <span style={{
                      fontWeight: 'bold',
                      color: item.status === 'Đang sử dụng' ? 'green' : item.status === 'Hư hỏng' ? 'red' : item.status === 'Đang sửa chữa' ? 'orange' : 'gray'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleViewDetail(item._id)} style={{ marginRight: '5px', cursor: 'pointer' }}>Xem</button>
                    <button onClick={() => handleEdit(item)} style={{ marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(item._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Khối xem Chi tiết thiết bị */}
      {selectedDevice && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', background: '#fafafa' }}>
          <h3>Chi Tiết Thiết Bị: {selectedDevice.name}</h3>
          <p><strong>Mã thiết bị:</strong> {selectedDevice.deviceId}</p>
          <p><strong>Loại:</strong> {selectedDevice.deviceType}</p>
          <p><strong>Phòng:</strong> {selectedDevice.room}</p>
          <p><strong>Hãng / Model:</strong> {selectedDevice.brand || 'N/A'} / {selectedDevice.model || 'N/A'}</p>
          <p><strong>Số lượng:</strong> {selectedDevice.quantity}</p>
          <p><strong>Trạng thái:</strong> {selectedDevice.status}</p>
          <p><strong>Mô tả:</strong> {selectedDevice.description || 'Không có mô tả'}</p>
          <button onClick={() => setSelectedDevice(null)} style={{ cursor: 'pointer' }}>Đóng chi tiết</button>
        </div>
      )}
    </div>
  );
}

export default App;