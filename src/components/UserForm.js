
import React, { useState } from "react";
import { TextField, Button, Paper, Stack, Snackbar, Alert } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "../api";

export default function UserForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "" });
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setForm({ name: "", email: "" });
      setSnack({ open: true, msg: "User berhasil ditambah (dummy).", severity: "success" });
    },
    onError: () => {
      setSnack({ open: true, msg: "Gagal Menambahkan User.", severity: "error" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    mutation.mutate(form);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Button type="submit" variant="contained">
            Tambah User
          </Button>
        </Stack>
      </form>
      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
