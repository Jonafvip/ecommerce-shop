import { useAuthContext } from "../context/AuthContext";
import { Layout } from "../layout/layout";

//componentes
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { deepOrange, indigo } from "@mui/material/colors";

export const Profile = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          padding: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "visible",
          }}
        >
          {/* Header Area with Gradient */}
          <Box
            sx={{
              height: 140,
              background: `linear-gradient(135deg, ${indigo[600]} 0%, ${indigo[400]} 100%)`,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Avatar
              sx={{
                width: 110,
                height: 110,
                fontSize: "2.8rem",
                bgcolor: deepOrange[500],
                border: "5px solid #fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                position: "absolute",
                bottom: -55,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          <CardContent sx={{ pt: 10, pb: 4, px: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              fontWeight="800"
              gutterBottom
              color="text.primary"
            >
              {user.username}
            </Typography>

            <Chip
              label={user.role.toUpperCase()}
              color="primary"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                px: 1,
                mb: 3,
                background: indigo[500],
              }}
            />

            <Divider sx={{ my: 3 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight="700"
              >
                Información de contacto
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "left", mt: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                textAlign={"center"}
              >
                Correo electrónico
              </Typography>
              <Typography variant="body1" fontWeight="500" sx={{ mb: 2 }} textAlign={"center"}>
                {user.email}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                textAlign={"center"}
              >
                ID de Usuario
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", color: "text.secondary" }}
                textAlign={"center"}
              >
                #{user.id}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};
