const db = require('../config/db');

// get all agents
exports.getAgents = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM agents');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// create new agent
exports.createAgent = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // ensure unique email or mobile
    const [existing] = await db.execute(
      'SELECT id FROM agents WHERE email = ? OR mobile = ?',
      [email, mobile],
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Agent with given email/mobile already exists' });
    }

    // include the ID of the user who is creating this agent
    const createdBy = req.user?.id;

    const [result] = await db.execute(
      'INSERT INTO agents (name, email, mobile, created_by) VALUES (?, ?, ?, ?)',
      [name, email, mobile, createdBy],
    );

    const newAgent = {
      id: result.insertId,
      name,
      email,
      mobile,
      created_by: createdBy,
    };

    res.status(201).json({ success: true, data: newAgent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// update agent
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile } = req.body;

    // check existence
    const [rows] = await db.execute('SELECT * FROM agents WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    // check if email/mobile already used by another record
    const [conflict] = await db.execute(
      'SELECT id FROM agents WHERE (email = ? OR mobile = ?) AND id != ?',
      [email, mobile, id],
    );
    if (conflict.length > 0) {
      return res.status(400).json({ success: false, message: 'Email or mobile already in use' });
    }

    await db.execute(
      'UPDATE agents SET name = ?, email = ?, mobile = ? WHERE id = ?',
      [name, email, mobile, id],
    );

    res.status(200).json({ success: true, message: 'Agent updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// delete agent
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM agents WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    await db.execute('DELETE FROM agents WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Agent deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};