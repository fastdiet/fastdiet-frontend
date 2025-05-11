import React from 'react';
import { View} from 'react-native';


const ViewInputs= ({ children }: { children: React.ReactNode }) => {
  return (
 <View style={{ width: "100%", gap:8 }}>
    {children}
</View>
  );
};

export default ViewInputs;
