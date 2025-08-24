
import React from "react";
import { Container, Typography } from "@mui/material";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";

export default function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        MANAJEMEN USER - INDICO
      </Typography>
      <UserForm />
      <UserTable />
    </Container>
  );
}
