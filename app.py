from PyQt6.QtWidgets import QApplication
import sys
from MainWindow import MainWindow


# Create application using the command line arguments
# We can pass [] if we are not going to pass any command line arguments
app = QApplication(sys.argv)

# Create Window
window = MainWindow()
window.show()  # Show window as windows are hidden by default

# Execute application
app.exec()
