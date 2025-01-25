import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { mockGeographyData as data } from "../data/mockData";

const GeographyChart = ({ isDashboard = false }) => {
  // Accessing the current theme to adjust colors based on light/dark mode
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  // Using theme's color palette for customization

  return (
    // ResponsiveChoropleth component for rendering a geographic choropleth map
    <ResponsiveChoropleth
      data={data}  // Data to be used for the geographic chart
      theme={{
        // Customizing axis appearance based on the theme
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],  
            },
          },
          legend: {
            text: {
              fill: colors.grey[100], 
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],  
              strokeWidth: 1,  
            },
            text: {
              fill: colors.grey[100],  
            },
          },
        },
        // Legends styling
        legends: {
          text: {
            fill: colors.grey[100],  
          },
        },
      }}
      features={geoFeatures.features}  
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}  
      domain={[0, 1000000]}  // Value domain range for data
      unknownColor="#666666"  // Color for features with no data
      label="properties.name"  // Label to display in the tooltip
      valueFormat=".2s"  // Value format for the tooltip, showing values in shorthand (e.g., 1k, 1M)
      
      // Dynamic projection settings for responsive layout based on `isDashboard` prop
      projectionScale={isDashboard ? 40 : 150}  // Scale for map projection (different for dashboard and non-dashboard)
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}  // Translation for map projection position
      projectionRotation={[0, 0, 0]}  // Rotation for the map projection
      borderWidth={1.5}  
      borderColor="#ffffff" 

      // Conditional legends settings based on `isDashboard` prop
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",  // Position the legend in the bottom-left corner
                direction: "column",  // Arrange the legend items in a vertical column
                justify: true,  // Justify the legend items
                translateX: 20,  // Horizontal translation for the legend
                translateY: -100,  // Vertical translation for the legend
                itemsSpacing: 0,  // No spacing between legend items
                itemWidth: 94,  
                itemHeight: 18,  
                itemDirection: "left-to-right",  // Direction of the legend items
                itemTextColor: colors.grey[100],  // Text color for the legend items
                itemOpacity: 0.85,  // Opacity for the legend items
                symbolSize: 18,  // Size of the legend symbols (circle)
                effects: [
                  {
                    on: "hover",  // Hover effect on legend items
                    style: {
                      itemTextColor: "#ffffff",  // Change text color on hover
                      itemOpacity: 1,  // Full opacity on hover
                    },
                  },
                ],
              },
            ]
          : undefined  // No legends if the component is in dashboard mode
      }
      
      // Custom tooltip to display feature information on hover
      tooltip={({ feature }) => (
        <div
          style={{
            background: theme.palette.mode === "dark" ? "#333" : "#fff",  // Background color based on theme
            color: theme.palette.mode === "dark" ? "#fff" : "#000", 
            padding: "5px 10px", 
            borderRadius: "4px", 
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
          }}
        >
          <strong>{feature.label}</strong>: {feature.value ? feature.value : "No data"}  
        </div>
      )}
    />
  );
};

export default GeographyChart;
