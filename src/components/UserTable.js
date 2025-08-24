
import React, { useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TextField, TablePagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Snackbar, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser, updateUser } from "../api";

export default function UserTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState({ id: null, name: "", email: "" });

  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  const mutationDelete = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSnack({ open: true, msg: "User berhasil dihapus (dummy).", severity: "success" });
    },
    onError: () => setSnack({ open: true, msg: "Gagal menghapus user.", severity: "error" })
  });

  const mutationUpdate = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSnack({ open: true, msg: "User berhasil di update (dummy).", severity: "success" });
      setEditOpen(false);
    },
    onError: () => setSnack({ open: true, msg: "Gagal mengupdate user.", severity: "error" })
  });

  const filtered = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const openEdit = (user) => {
    setEditUser({ id: user.id, name: user.name, email: user.email });
    setEditOpen(true);
  };

  const submitEdit = () => {
    const { id, name, email } = editUser;
    if (!id) return;
    mutationUpdate.mutate({ id, name, email });
  };

  if (isLoading) return <Paper sx={{p:2}}>Loading...</Paper>;
  if (isError) return <Paper sx={{p:2}}>Error loading users.</Paper>;

  return (
    <Paper sx={{ p: 2 }}>
      <TextField
        label="Cari Nama"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell>Id</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Perusahaan</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company?.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => openEdit(user)}
                    aria-label={`edit-${user.id}`}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => mutationDelete.mutate(user.id)}
                    aria-label={`delete-${user.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            margin="dense"
            label="Nama"
            fullWidth
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
