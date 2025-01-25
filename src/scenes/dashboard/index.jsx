import { Box, Button, IconButton, Typography, useTheme, Modal, TextField } from "@mui/material";
import {
  Email as EmailIcon,
  PointOfSale as PointOfSaleIcon,
  Traffic as TrafficIcon
} from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import  React, {useState, useEffect}  from "react";

import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import { ResizableBox } from "react-resizable";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import "react-resizable/css/styles.css"

// Draggable Box Component
const DraggableBox = ({ id, index, box, moveBox, removeBox, editBox }) => {
  // Accessing the theme for styling
  const theme = useTheme();

  // Defining the draggable functionality
  const [, ref] = useDrag({
    type: 'BOX', // type of the draggable item
    item: { id, index }, // item properties (id and index)
  });

  // Defining the drop functionality for when an item is dropped
  const [, drop] = useDrop({
    accept: 'BOX', // accepts items of type 'BOX'
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveBox(draggedItem.index, index); // Move box to new index
        draggedItem.index = index; // Update the index of the dragged item
      }
    },
  });

  // Styles for the widget box
  const widgetStyles = {
    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
    padding: '10px',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.palette.mode === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.6)' : '0px 4px 10px rgba(0, 0, 0, 0.1)',
    margin: '20px',
  };

  return (
    <ResizableBox
      width={box.size.width}
      height={box.size.height}
      minConstraints={[200, 150]} // Minimum size constraints for resizing
      maxConstraints={[700, 500]} // Maximum size constraints for resizing
      resizeHandles={['se']} // Resize handle position
      display="flex"
      flexDirection="column"
      style={widgetStyles}
    >
      {/* Draggable content inside the widget */}
      <Box
        ref={(node) => ref(drop(node))} // Combine drag and drop functionality
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ cursor: 'move' }} // Cursor style when moving
      >
        {box.content} {/* Render dynamic content */}
      </Box>

      {/* Edit Button */}
      <IconButton
        sx={{ position: 'absolute', top: 5, right: 40, color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
        onClick={() => editBox(id)} // Trigger editBox function on click
      >
        <EditIcon />
      </IconButton>

      {/* Remove Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
          color: theme.palette.mode === 'dark' ? 'white' : 'black',
        }}
        onClick={() => removeBox(id)} // Trigger removeBox function on click
      >
        <CloseIcon />
      </IconButton>
    </ResizableBox>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  // Loading widgets from localStorage or initializing with default values
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('widgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [
      // Initial widget data
      {
        id: 1,
        size: { width: 300, height: 200 },
        contentType: 'StatBox',
        contentProps: {
          title: '12,361',
          subtitle: 'Emails Sent',
          progress: '0.75',
          increase: '+14%',
          icon: 'EmailIcon',
        },
      },
      {
        id: 2,
        size: { width: 300, height: 200 },
        contentType: 'StatBox',
        contentProps: {
          title: '431,225',
          subtitle: 'Sales Obtained',
          progress: '0.50',
          increase: '+21%',
          icon: 'PointOfSaleIcon',
        },
      },
      {
        id: 3,
        size: { width: 300, height: 200 },
        contentType: 'StatBox',
        contentProps: {
          title:'1,325,134',
          subtitle:'Traffic Received',
          progress:'0.80',
          increase:'+43%',
          icon: 'TrafficIcon'
        }
          
      },
      {
        id: 4,
        size: { width: 600, height: 300 },
        contentType: 'LineChart',
        contentProps: {
          title: 'Revenue Generated',
          isDashboard: true,
        },
      },
      {
        id: 5,
        size: { width: 600, height: 300 },
        contentType: 'GeographyChart',
        contentProps: {
          title: 'Geography Based Traffic',
          isDashboard: true,
          projectionType: 'mercator',
        },
      },
    ];
  });

  // Saving widgets state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('widgets', JSON.stringify(widgets));
  }, [widgets]);

  const theme = useTheme();
  const [editingWidget, setEditingWidget] = useState(null); // State to track the widget being edited
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state

  const iconMapping = {
    EmailIcon: EmailIcon, // Icon mapping for widgets
    PointOfSaleIcon: PointOfSaleIcon,
    TrafficIcon: TrafficIcon,
  };

  // Function to move a box/widget within the layout
  const moveBox = (fromIndex, toIndex) => {
    setWidgets((prevWidgets) => {
      const updatedWidgets = [...prevWidgets];
      const [movedWidget] = updatedWidgets.splice(fromIndex, 1); // Remove widget
      updatedWidgets.splice(toIndex, 0, movedWidget); // Add widget at new index
      return updatedWidgets;
    });
  };

  // Function to edit a widget
  const editBox = (id) => {
    const widget = widgets.find((widget) => widget.id === id); // Find widget by ID
    if (!widget) return;
    setEditingWidget({ ...widget }); // Set the widget to be edited
    setModalOpen(true); // Open modal
  };

  // Function to save the widget after editing
  const saveEdit = () => {
    if (!editingWidget) return;

    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === editingWidget.id ? { ...editingWidget } : widget // Update the widget with edited data
      )
    );
    setEditingWidget(null); // Reset editing state
    setModalOpen(false); // Close modal
  };

  // Function to remove a widget
  const removeBox = (id) => {
    setWidgets(widgets.filter((widget) => widget.id !== id)); // Filter out the removed widget
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setModalOpen(false); // Close modal
  };

  // Render content dynamically based on contentType
  const renderContent = (widget) => {
    switch (widget.contentType) {
      case 'StatBox': {
        const IconComponent = iconMapping[widget.contentProps.icon]; // Get the correct icon
        if (!IconComponent) {
          console.error(`Icon "${widget.contentProps.icon}" not found.`);
          return null;
        }
        return (
          <StatBox
            title={widget.contentProps.title}
            subtitle={widget.contentProps.subtitle}
            progress={widget.contentProps.progress}
            increase={widget.contentProps.increase}
            icon={<IconComponent />}
          />
        );
      }
      case 'LineChart': {
        return (
          <Box height="100%" width="100%">
            <Typography variant="h5" fontWeight="600" color="#FFFFFF" mb={2}>
              {widget.contentProps.title}
            </Typography>
            <LineChart isDashboard={widget.contentProps.isDashboard} />
          </Box>
        );
      }
      case 'GeographyChart': {
        return (
          <Box height="100%" width="100%">
            <Typography variant="h5" fontWeight="600" color="#FFFFFF" mb={2}>
              {widget.contentProps.title}
            </Typography>
            <GeographyChart
              isDashboard={widget.contentProps.isDashboard}
              projectionType={widget.contentProps.projectionType}
            />
          </Box>
        );
      }
      default:
        console.error(`Unknown content type: ${widget.contentType}`);
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box m="20px" display="flex" flexWrap="wrap">
        {/* Render draggable boxes/widgets */}
        {widgets.map((widget, index) => (
          <DraggableBox
            key={widget.id}
            id={widget.id}
            index={index}
            box={{ ...widget, content: renderContent(widget) }}
            moveBox={moveBox}
            removeBox={removeBox}
            editBox={editBox}
          />
        ))}
      </Box>

      {/* Modal with background overlay for editing widget */}
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
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                paddingBottom: '10px',
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* TextField for editing widget content */}
            <TextField
               style={{ marginTop: '20px', marginBottom: '70px'}}
              variant="outlined"
              value={editingWidget?.contentProps?.title || ''}
              onChange={(e) => setEditingWidget({
                ...editingWidget,
                contentProps: { ...editingWidget.contentProps, title: e.target.value },
              })}
            />

            {/* Button to save the changes */}
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
