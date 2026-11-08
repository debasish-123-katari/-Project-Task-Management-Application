import { useEffect, useState } from 'react';
import api from '../api';
const initial = { title:'', description:'', status:'todo', priority:'medium', dueDate:'', assignee:'' };
export default function TaskForm({ projectId, task, onSaved, onCancel }) {
  const [form, setForm] = useState(initial); const [users, setUsers] = useState([]); const [error, setError] = useState('');
  useEffect(() => { api.get('/users').then(r=>setUsers(r.data.users)).catch(()=>{}); }, []);
  useEffect(() => { if (task) setForm({ title:task.title||'', description:task.description||'', status:task.status||'todo', priority:task.priority||'medium', dueDate:task.dueDate?task.dueDate.slice(0,10):'', assignee:task.assignee?._id||task.assignee?.id||'' }); else setForm(initial); }, [task]);
  function change(e) { setForm({...form,[e.target.name]:e.target.value}); }
  async function submit(e) { e.preventDefault(); setError(''); try { if(task) await api.patch(`/tasks/${task._id}`,form); else await api.post(`/tasks/projects/${projectId}/tasks`,form); onSaved(); } catch(e) { setError(e.message); } }
  return <form className="form-stack" onSubmit={submit}>
    {error&&<div className="alert">{error}</div>}
    <label>Task title<input required name="title" value={form.title} onChange={change} placeholder="e.g. Build sign-in page"/></label>
    <label>Description<textarea name="description" value={form.description} onChange={change} rows="3" placeholder="What needs to be done?"/></label>
    <div className="form-row"><label>Priority<select name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label>Status<select name="status" value={form.status} onChange={change}><option value="todo">To do</option><option value="in-progress">In progress</option><option value="done">Done</option></select></label></div>
    <div className="form-row"><label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={change}/></label><label>Assign to<select name="assignee" value={form.assignee} onChange={change}><option value="">Unassigned</option>{users.map(u=><option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}</select></label></div>
    <div className="form-actions"><button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button><button className="btn btn-primary">{task?'Save changes':'Create task'}</button></div>
  </form>;
}
