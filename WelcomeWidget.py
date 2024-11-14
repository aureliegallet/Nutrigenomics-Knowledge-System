from PyQt6.QtWidgets import ( 
    QPushButton, 
    QLabel, 
    QVBoxLayout, 
    QWidget
)
from PyQt6.QtCore import QSize, Qt


# Class MainWindow inherits from the Qt MainWindow
class WelcomeWidget(QWidget):
    def __init__(self):
        super().__init__()

        # Make text
        welcomeLabel = QLabel("Welcome to our knowledge system!")
        welcomeLabel.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter) 
        # Note: we need to use the OR pipe to combine two alignment flags
        
        # Make button 
        self.button = QPushButton("Say Hello!")
        self.button.setCheckable(True)
        self.button.clicked.connect(self.the_button_was_clicked)

        # Make layout
        layout = QVBoxLayout()
        layout.addWidget(welcomeLabel)
        layout.addWidget(self.button)
        self.setLayout(layout)

    def the_button_was_clicked(self, checked):
        if checked == True:
            self.button.setText("Say Goodbye!")
        else: 
            self.button.setText("Say Hello!")



    