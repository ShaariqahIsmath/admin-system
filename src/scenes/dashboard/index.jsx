import { Box, Button, IconButton, Typography, useTheme, Modal, TextField } from "@mui/material";
import { tokens,  } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import  React, {useState}  from "react";
import TrafficIcon from "@mui/icons-material/Traffic";

import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { ResizableBox } from "react-resizable";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import "react-resizable/css/styles.css"




const DraggableBox = ({ id, index, box, moveBox, removeBox, editBox }) => {

    const theme = useTheme();
    const [, ref] = useDrag({
      type: "BOX",
      item: { id, index },
    });
  
    const [, drop] = useDrop({
      accept: "BOX",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveBox(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const widgetStyles = {
        backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
        padding: "10px",
        borderRadius: "8px",
        position: "relative",
        overflow: "hidden",
        boxShadow: theme.palette.mode === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.6)' : '0px 4px 10px rgba(0, 0, 0, 0.1)', 
        margin: "20px"
      };
  
    return (
      <ResizableBox
        width={box.size.width}
        height={box.size.height}
        minConstraints={[200, 150]}
        maxConstraints={[700, 500]}
        resizeHandles={["se"]}
        display="flex"
        flexDirection="column"
        style={widgetStyles}
      >
        <Box
          ref={(node) => ref(drop(node))}
          height="100%"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"

          sx={{ cursor: "move" }}
        >
          {box.content}
        </Box>
        <IconButton
          sx={{ position: "absolute", top: 5, right: 40, color: "white" }}
          onClick={() => editBox(id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            color: "white",
          }}
          onClick={() => removeBox(id)}
        >
          <CloseIcon />
        </IconButton>
      </ResizableBox>
    );
  };
  
  const Dashboard = () => {
        const theme = useTheme();
    const [widgets, setWidgets] = useState([
      {
        id: 1,
        size: { width: 300, height: 200 },
        content: (
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={<EmailIcon sx={{ color: "green", fontSize: "26px" }} />}
          />
        ),
      },
      {
        id: 2,
        size: { width: 300, height: 200 },
        content: (
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={<PointOfSaleIcon sx={{ color: "green", fontSize: "26px" }} />}
          />
        ),
      },
      {
        id: 3,
        size: { width: 300, height: 200 },
        content: (
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={<TrafficIcon sx={{ color: "green", fontSize: "26px" }} />}
          />
        ),
      },
      {
        id: 4,
        size: { width: 600, height: 300 },
        content: (
          <Box height="100%" width="100%">
            <Typography variant="h5" fontWeight="600" color="#FFFFFF" mb={2}>
              Revenue Generated
            </Typography>
            <LineChart isDashboard={true}
             />
          </Box>
        ),
      },
      {
        id: 5,
        size: { width: 600, height: 300 },
        content: (
          <Box height="100%" width="100%"   
         >
            <Typography variant="h5" fontWeight="600" color="#FFFFFF" mb={2} >
              Geography Based Traffic
            </Typography>
            <GeographyChart isDashboard={true}   projectionType="mercator"
 />
          </Box>
        ),
      },
    ]);

    const [editingWidget, setEditingWidget] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newContent, setNewContent] = useState("");
  
    const moveBox = (fromIndex, toIndex) => {
      const updatedWidgets = [...widgets];
      const [movedWidget] = updatedWidgets.splice(fromIndex, 1);
      updatedWidgets.splice(toIndex, 0, movedWidget);
      setWidgets(updatedWidgets);
    };
  
    const removeBox = (id) => {
      setWidgets(widgets.filter((widget) => widget.id !== id));
    };

      const editBox = (id) => {
        const widget = widgets.find((widget) => widget.id === id);
        
        const content = widget.content;
        
        if (typeof content === "string") {
          setNewContent(content);
        } else if (React.isValidElement(content)) {

          const title = '';
          setNewContent(title);
        } else {
          setNewContent(""); 
        }
      
        setEditingWidget(widget);
        setModalOpen(true);
      };
      

    const saveEdit = () => {
        console.log('Saving content:', newContent); 
        setWidgets(
        widgets.map((widget) =>
            widget.id === editingWidget.id
            ? { ...widget, content: newContent } 
            : widget
        )
        );
        setModalOpen(false);
    };

    const cancelEdit = () => {
        setModalOpen(false);
    };

    const textFieldStyles = {
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'white', 
        color: theme.palette.mode === 'dark' ? 'white' : 'black', 
        borderRadius: '4px',
        boxShadow: 'none',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#444' : '#ccc', 
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#666' : '#999', 
          },
        },
      };

      return (
        <DndProvider backend={HTML5Backend}>
          <Box m="20px" display="flex" flexWrap="wrap">
            {widgets.map((widget, index) => (
              <DraggableBox
                key={widget.id}
                id={widget.id}
                index={index}
                box={widget}
                moveBox={moveBox}
                removeBox={removeBox}
                editBox={editBox}
              />
            ))}
          </Box>
    
          {/* Modal with background overlay */}
          <Modal open={modalOpen} onClose={cancelEdit}>
            <Box
              position="fixed"
              width="100%"
              height="100%"
              bgcolor="rgba(0, 0, 0, 0.7)" 
              zIndex={1000} 
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                p={3}
                bgcolor={theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'}
                borderRadius="8px"
                display="flex"
                flexDirection="column"
                gap={2}
                width="400px"
                minHeight="250px"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
                position="relative"
              >
                {/* Close Button */}
                <IconButton
                  onClick={cancelEdit}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: theme.palette.mode === 'dark' ? 'white' : 'red', 
                    paddingBottom: "10px"
                  }}
                >
                  <CloseIcon />
                </IconButton>
    
                {/* TextField for editing content */}
                <TextField
                  label="Edit Content"
                  multiline
                  rows={4}
                  value={newContent} // Ensure it's a string
                  onChange={(e) => {
                    console.log('TextField onChange:', e.target.value); 
                    setNewContent(e.target.value); 
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    ...textFieldStyles,
                    marginTop: '30px', 
                  }}
                />
    
                <Button variant="contained" color="primary" onClick={saveEdit}>
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>
        </DndProvider>
      );
      
    };
  
  export default Dashboard;