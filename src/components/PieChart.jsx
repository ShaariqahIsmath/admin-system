import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockPieData as data } from "../data/mockData";

const PieChart = () => {
  // Accessing the current theme to apply dynamic colors
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  // Using the theme's palette for colors

  return (
    // ResponsivePie component for rendering the pie chart
    <ResponsivePie
      data={data}  // Data for the pie chart
      theme={{
        // Customizing axis styling based on the theme
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100], 
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

      }

      margin={{ top: 40, right: 80, bottom: 80, left: 80 }} 
      innerRadius={0.5}  // Defines the inner radius of the pie chart (donut chart effect)
      padAngle={0.7}  // Angle between each slice
      cornerRadius={3}  // Round the corners of each slice
      activeOuterRadiusOffset={8}  // Offset for active (hovered) slices
      borderColor={{
        from: "color",  // Border color based on slice color
        modifiers: [["darker", 0.2]],  // Darkens the border slightly
      }}
      arcLinkLabelsSkipAngle={10}  // Skip arc link labels if the angle is too small
      arcLinkLabelsTextColor={colors.grey[100]}  // Arc link labels text color
      arcLinkLabelsThickness={2}  // Thickness of arc link labels
      arcLinkLabelsColor={{ from: "color" }}  // Arc link labels color based on slice color
      enableArcLabels={false}  // Disable arc labels on slices
      arcLabelsRadiusOffset={0.4}  // Adjusts the position of arc labels
      arcLabelsSkipAngle={7}  // Skip arc labels if the angle is too small
      arcLabelsTextColor={{
        from: "color",  // Arc labels text color based on slice color
        modifiers: [["darker", 2]],  // Darken the text color slightly
      }}

      // Defining custom patterns to fill slices
      defs={[
        {
          id: "dots",  // Define a pattern for dots
          type: "patternDots",
          background: "inherit",  
          color: "rgba(255, 255, 255, 0.3)",  
          size: 4,  
          padding: 1,  
          stagger: true,  
        },
        {
          id: "lines",  // Define a pattern for lines
          type: "patternLines",
          background: "inherit",  
          color: "rgba(255, 255, 255, 0.3)",  
          rotation: -45,  
          lineWidth: 6,  
          spacing: 10,  
        },
      ]}
      // Legends configuration for displaying the legend below the chart
      legends={[
        {
          anchor: "bottom",  // Position the legend at the bottom of the chart
          direction: "row",  // Arrange legend items in a horizontal row
          justify: false,  // Do not justify the legend items
          translateX: 0,  // No horizontal translation
          translateY: 56,  // Vertically translate the legend
          itemsSpacing: 0,  // No spacing between items
          itemWidth: 100,  // Width of each legend item
          itemHeight: 18,  // Height of each legend item
          itemTextColor: "#999",  // Text color of legend items
          itemDirection: "left-to-right",  // Arrange legend items from left to right
          itemOpacity: 1,  // Full opacity for legend items
          symbolSize: 18,  // Size of the legend symbols (circle)
          symbolShape: "circle",  // Shape of the legend symbol
          // Effects when hovering over legend items
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",  // Change text color on hover
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
