import Text "mo:base/Text";

import Float "mo:base/Float";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(x : Float, y : Float, op : Text) : async ?Float {
    switch (op) {
      case "+" { return ?(x + y); };
      case "-" { return ?(x - y); };
      case "*" { return ?(x * y); };
      case "/" {
        if (y == 0) {
          Debug.print("Error: Division by zero");
          return null;
        };
        return ?(x / y);
      };
      case _ {
        Debug.print("Error: Invalid operation");
        return null;
      };
    };
  };

  public func clearMemory() : async () {
    // This function is a placeholder as we don't have any persistent state to clear
    Debug.print("Memory cleared");
  };
}
